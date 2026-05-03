from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine   
from pymongo import AsyncMongoClient
from datetime import datetime, timezone
import os
import asyncio
import models, schemas, crud
import uuid

''' || 1. POSTGRESQL SETUP ||'''
models.Base.metadata.create_all(bind=engine)

''' || 2. MONGODB SETUP ||'''
@asynccontextmanager
async def get_mongo_client(app: FastAPI):
    MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")

    app.mongodb_client = AsyncMongoClient(MONGO_URL)
    app.mongodb = app.mongodb_client["inventory_logs"]
    print("Connected to MongoDB")

    yield

    app.mongodb_client.close()
    print("MongoDB connection closed")

app = FastAPI(lifespan=get_mongo_client)

''' || 3. CORS MIDDLEWARE || '''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

''' || 4. LOGGING MIDDLEWARE || '''
def logging_action(method: str, path: str) -> str:
    normalized_path = path.rstrip("/")

    if not normalized_path.startswith("/items"):
        return "SYSTEM_PING"
    
    if method == "GET":
        return "VIEW_INVENTORY" if normalized_path == "/items" else "VIEW_ITEM_DETAIL"
    action_map = {
        "POST": "ADD_INVENTORY",
        "PUT": "EDIT_INVENTORY",
        "DELETE": "DELETE_INVENTORY"
    }
    return action_map.get(method, "UNKNOWN_ACTION")

@app.middleware("http")
async def mongodb_logging(request: Request, call_next):
    start_time = datetime.now(timezone.utc)
    response = await call_next(request)

    log_entry = {
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "method": request.method,
        "endpoint": request.url.path,
        "action": logging_action(request.method, request.url.path),
        "user_agent": request.headers.get("user-agent", "unknown"),
    }

    api_logs_collection = request.app.mongodb["api_logs"]
    await api_logs_collection.insert_one(log_entry)

    return response

''' || 5. POSTGRES CRUD ENDPOINTS || '''
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/items/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(models.Item).offset(skip).limit(limit).all()
    return items
@app.get("/items/{item_id}", response_model=schemas.Item)
def read_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.get_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@app.put("/items/{item_id}", response_model=schemas.Item)
def update_item(item_id: uuid.UUID, item: schemas.ItemUpdate, db: Session = Depends(get_db)):
    db_item = crud.update_item(db, item_id=item_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@app.delete("/items/{item_id}")
def delete_item(item_id: uuid.UUID, db: Session = Depends(get_db)):
    db_item = crud.delete_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}