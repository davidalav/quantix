import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel, EmailStr

load_dotenv()

DB_URL = os.environ.get("DB_URL")

if not DB_URL:
    raise ValueError("DB_URL is not set")

engine = create_engine(DB_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Item(Base):
    __tablename__ = "items"
    id    = Column(Integer, primary_key=True)
    name  = Column(String, nullable=False)
    note  = Column(String)

class UserDB(Base):
    __tablename__ = "users"

    # Убрали несуществующий аргумент primary_base=True
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    model_config = {"from_attributes": True}

Base.metadata.create_all(engine)
