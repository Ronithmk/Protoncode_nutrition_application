from sqlalchemy import Column, Integer, String
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String)
    email    = Column(String, unique=True, index=True)
    password = Column(String)
    role     = Column(String, default="user")   # "user" or "admin"


class Media(Base):
    __tablename__ = "media"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    description = Column(String, default="")
    type        = Column(String, nullable=False)   # "video" | "image" | "audio"
    filename    = Column(String, nullable=False)
    url         = Column(String, nullable=False)
    category    = Column(String, default="general")
    uploaded_by = Column(String, default="admin")  # stores admin email