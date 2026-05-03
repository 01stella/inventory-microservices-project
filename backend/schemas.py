from pydantic import BaseModel, Field
from typing import Optional
import uuid

class ItemBase(BaseModel):
    short_name: str = Field(..., min_length=1, max_length=20)
    description: Optional[str] = Field(default = "N/A")
    price: float = Field(..., gt=0)
    amount: int = Field(..., ge=0)

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

