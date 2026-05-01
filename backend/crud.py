from sqlalchemy.orm import Session
import models, schemas
import uuid

def get_item(db: Session, item_id: uuid.UUID):
    return db.query(models.Item).filter(models.Item.id == item_id).first()

def create_item(db: Session, item: schemas.ItemCreate):
    db_item = models.Item(
        id=uuid.uuid4(),
        short_name=item.short_name,
        description=item.description,
        price=item.price,
        amount=item.amount
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: uuid.UUID, item: schemas.ItemUpdate):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not db_item:
        return None
    if item.short_name is not None:
        db_item.short_name = item.short_name
    if item.description is not None:
        db_item.description = item.description
    if item.price is not None:
        db_item.price = item.price
    if item.amount is not None:
        db_item.amount = item.amount
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: uuid.UUID):
    db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item