from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

from app import models, schemas
from app.database import get_db

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Admin secret key (change this to something strong in production)
ADMIN_SECRET_KEY = "nutritrack-admin-2024"

# OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# -------------------------------
# Password Functions
# -------------------------------

def hash_password(password: str):
    return pwd_context.hash(password[:72])


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password[:72], hashed_password)


# -------------------------------
# Create JWT Token (with role)
# -------------------------------

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------------
# Register
# -------------------------------

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role="user"                  # default role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


# -------------------------------
# User Login
# -------------------------------

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token(
        {"sub": db_user.email, "role": db_user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role
    }


# -------------------------------
# Admin Login
# -------------------------------

@router.post("/admin/login")
def admin_login(user: schemas.AdminLogin, db: Session = Depends(get_db)):

    # Check admin secret key first
    if user.admin_key != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    # Must be an admin role in DB too
    if db_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied. Not an admin account.")

    access_token = create_access_token(
        {"sub": db_user.email, "role": "admin"}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "admin"
    }


# -------------------------------
# Get Current User from Token
# -------------------------------

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email, "role": payload.get("role", "user")}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# -------------------------------
# Require Admin Role
# -------------------------------

def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# -------------------------------
# Profile (Protected Route)
# -------------------------------

@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Welcome",
        "user": current_user["email"],
        "role": current_user["role"]
    }


# -------------------------------
# Admin-only Test Route
# -------------------------------

@router.get("/admin/dashboard")
def admin_dashboard(current_user: dict = Depends(require_admin)):
    return {
        "message": "Welcome to Admin Panel",
        "admin": current_user["email"]
    }