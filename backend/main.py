from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app import auth
from app.database import engine
from app import models
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import shutil
import os
import uuid

# ✅ Load .env
load_dotenv()

SECRET_KEY      = os.getenv("SECRET_KEY")
ADMIN_EMAIL     = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD  = os.getenv("ADMIN_PASSWORD")
BASE_URL        = os.getenv("BASE_URL", "http://127.0.0.1:8000")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# ✅ Debug — remove after confirming login works
print("========================================")
print("SECRET_KEY  :", repr(SECRET_KEY))
print("ADMIN_EMAIL :", repr(ADMIN_EMAIL))
print("ADMIN_PASS  :", repr(ADMIN_PASSWORD))
print("========================================")

app = FastAPI()

# ✅ Create DB tables
models.Base.metadata.create_all(bind=engine)

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Ensure upload folder exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Allowed file types
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".mp3", ".wav"}
ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/gif", "image/webp",
    "video/mp4", "audio/mpeg", "audio/wav"
}

# ✅ Static folders
app.mount("/gifs",    StaticFiles(directory="exercise_data/gifs"), name="gifs")
app.mount("/uploads", StaticFiles(directory="uploads"),            name="uploads")


# ─────────────────────────────────────────────────────────────────────────────
# ✅ ADMIN LOGIN — registered BEFORE auth.router to prevent 403
# ─────────────────────────────────────────────────────────────────────────────

class AdminLoginRequest(BaseModel):
    email:     str
    password:  str
    admin_key: str

@app.post("/admin/login")
def admin_login(data: AdminLoginRequest):
    # Debug prints — remove after login works
    print("--- Admin login attempt ---")
    print("Received  email    :", repr(data.email))
    print("Received  password :", repr(data.password))
    print("Received  admin_key:", repr(data.admin_key))
    print("Expected  email    :", repr(ADMIN_EMAIL))
    print("Expected  password :", repr(ADMIN_PASSWORD))
    print("Expected  key      :", repr(SECRET_KEY))

    if (
        data.email     != ADMIN_EMAIL    or
        data.password  != ADMIN_PASSWORD or
        data.admin_key != SECRET_KEY
    ):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    return {
        "access_token": SECRET_KEY,
        "role":         "admin",
        "message":      "Admin login successful ✅"
    }


# ✅ Auth router — registered AFTER /admin/login
app.include_router(auth.router)


# ✅ Root
@app.get("/")
def root():
    return {"message": "API working ✅"}


# ─────────────────────────────────────────────────────────────────────────────
# BODY PART MAPPING
# ─────────────────────────────────────────────────────────────────────────────

BODY_MAP = {
    "chest":      ["chest"],
    "back":       ["lats", "middle back", "lower back"],
    "legs":       ["quadriceps", "hamstrings", "glutes", "calves"],
    "upper legs": ["quadriceps", "hamstrings"],
    "lower legs": ["calves"],
    "shoulders":  ["shoulders"],
    "arms":       ["biceps", "triceps", "forearms"],
    "abs":        ["abdominals"],
}


# ─────────────────────────────────────────────────────────────────────────────
# EXERCISE API
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/exercises/{body_part}")
def get_exercises(body_part: str):
    try:
        with open("exercise_data/exercises.json") as f:
            data = json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Exercise data file not found")

    target_muscles = BODY_MAP.get(body_part.lower(), [])
    if not target_muscles:
        raise HTTPException(status_code=404, detail=f"Body part '{body_part}' not recognised")

    result = []
    for ex in data:
        muscles = [m.lower() for m in ex.get("primaryMuscles", [])]
        images  = ex.get("images", [])
        if any(m in muscles for m in target_muscles) and images:
            result.append({
                "id":       ex["id"],
                "name":     ex["name"],
                "bodyPart": body_part,
                "target":   ex["primaryMuscles"][0],
                "gifUrl":   f"{BASE_URL}/gifs/{images[0]}",
            })
    return result


# ─────────────────────────────────────────────────────────────────────────────
# UPLOAD API
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400,
            detail=f"File type '{file.content_type}' not allowed.")

    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Extension '{ext}' not allowed.")

    safe_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": safe_name,
        "original": file.filename,
        "url":      f"{BASE_URL}/uploads/{safe_name}",
    }


# ─────────────────────────────────────────────────────────────────────────────
# GET ALL UPLOADED FILES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/files")
def get_uploaded_files():
    files = [
        f for f in os.listdir(UPLOAD_DIR)
        if os.path.isfile(os.path.join(UPLOAD_DIR, f)) and not f.startswith(".")
    ]
    return [{"filename": f, "url": f"{BASE_URL}/uploads/{f}"} for f in files]