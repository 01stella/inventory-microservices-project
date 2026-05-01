from fastapi import FastAPI
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

DATABASE_URL = "postgresql+psycopg2://admin:secretpassword@localhost:5432/inventory"

app = FastAPI()
engine = create_engine(DATABASE_URL, echo=True)

# testing if connection with database works
try:
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print("Database connection successful.")
except SQLAlchemyError as e:
    print(f"Error connecting to database: {e}")

@app.get("/")
def home():
    return {"status": "Inventory API is running."}
