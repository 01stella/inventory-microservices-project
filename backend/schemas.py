from pydantic import BaseModel
from typing import Optional
import uuid

class ItemBase(BaseModel):
    short_name: str
    description: Optional[str] = None
    price: int
    amount: int

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    short_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    amount: Optional[int] = None

class Item(ItemBase):
    id: uuid.UUID

    class Config:
        from_attributes = True

