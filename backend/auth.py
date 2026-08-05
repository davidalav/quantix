import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
import bcrypt  # Работаем напрямую с bcrypt, убираем ломающийся passlib
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from db import UserDB, get_db

SECRET_KEY = os.environ.get("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # токен живёт сутки

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="/login/", auto_error=False)


# --- НАДЁЖНЫЕ ФУНКЦИИ ХЭШИРОВАНИЯ БЕЗ PASSLIB ---
def hash_password(password: str) -> str:
    """Хэширует строковый пароль напрямую через bcrypt с переводом в байты."""
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Безопасно проверяет чистый пароль против сохраненного хэша."""
    try:
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False


# --- СБОРКА И ПРОВЕРКА JWT ТОКЕНОВ ---
def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserDB:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except jwt.PyJWTError:
        raise credentials_error

    user = db.query(UserDB).filter(UserDB.id == int(user_id)).first()
    if user is None:
        raise credentials_error

    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db),
) -> Optional[UserDB]:
    """
    Как get_current_user, но не кидает 401, если токена нет — возвращает None.
    Нужно, чтобы один и тот же роут работал и для гостей, и для залогиненных.
    """
    if not token:
        return None

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            return None
    except jwt.PyJWTError:
        return None

    return db.query(UserDB).filter(UserDB.id == int(user_id)).first()
