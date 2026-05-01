import uuid
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, text
from sqlalchemy.dialects.postgresql import UUID

class Base(DeclarativeBase):
    pass

class Item(Base):
    # __tablename__ is used to specify the name of the database table that this model will be mapped to. 
    # "__" to avoid naming collisions 
    __tablename__ = "items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # index = True is used to create an index on the column, which can improve search performance when querying by this column. 
    short_name: Mapped[str] = mapped_column(String(50), index=True)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    price: Mapped[int] = mapped_column(Integer)
    amount: Mapped[int] = mapped_column(Integer, default=0)