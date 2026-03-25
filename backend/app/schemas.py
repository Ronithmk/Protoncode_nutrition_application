from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


# Add this new schema for admin login
class AdminLogin(BaseModel):
    email: str
    password: str
    admin_key: str          # the secret admin key from the frontend