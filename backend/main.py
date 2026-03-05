from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth
from app.database import engine, Base
from app import models

# Auto create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "API working"}