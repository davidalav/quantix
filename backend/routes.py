from fastapi import APIRouter, status, Depends, HTTPException
from backend.db import Session, UserCreate, UserResponse, UserDB, get_db

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Quantix backend is alive!"}

@router.get("/health")
def health():
    return {
        "status": "ok",
        "project": "quantix"
    }

@router.get("/scraped-data")
def scrapedData():
    return {
        "data": {
            "item": "phone",
            "price": "100$"
        },
        "scraped_at": "2026-07-22"
    }

@router.post("/create_user/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(UserDB.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = UserDB(
        username=user_data.username,
        email=user_data.email,
        hashed_password=user_data.password 
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/all_users/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(UserDB).all()
    return users

@router.get("/userbyid/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user