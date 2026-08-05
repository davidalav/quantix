from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session

from db import UserCreate, UserResponse, UserDB, LoginRequest, get_db
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.get("/")
def home():
    return {"message": "Quantix backend is alive!"}


@router.get("/health")
def health():
    return {"status": "ok", "project": "quantix"}


@router.post("/create_user/", status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(UserDB).filter(
        (UserDB.email == user_data.email) | (UserDB.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    db_user = UserDB(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # авто-логин сразу после регистрации — фронт этого и ждёт
    token = create_access_token(db_user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": db_user.id, "username": db_user.username, "email": db_user.email},
    }


@router.post("/login/")
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == credentials.username).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "username": user.username, "email": user.email},
    }

@router.post("/logout/")
def logout():
    return {"message": "Logged out successfully", "refresh_required": True}



@router.get("/me")
def me(current_user: UserDB = Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "email": current_user.email}


@router.get("/all_users/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(UserDB).all()


@router.get("/userbyid/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user