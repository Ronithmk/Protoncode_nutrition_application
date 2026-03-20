from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import auth
from app.database import engine
from app import models
import requests

app = FastAPI()
models.Base.metadata.create_all(bind=engine)

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

@app.get("/exercises/{body_part}")
def get_exercises(body_part: str):
    url = f"https://exercisedb.p.rapidapi.com/exercises/bodyPart/{body_part}"

    headers = {
        "X-RapidAPI-Key": "3384820908msh4410329c17bc93ep141a50jsn705166746724",
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
    }

    params = {"limit": 20, "offset": 0}

    try:
        response = requests.get(url, headers=headers, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()

        # Build gifUrl using GitHub free exercise DB (images hosted publicly)
        for ex in data:
            ex_id = ex.get("id", "")
            # Convert "0009" to integer then back: "0009" -> 9
            numeric_id = int(ex_id)
            ex["gifUrl"] = f"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{numeric_id}/0.jpg"

        print(f"✅ Got {len(data)} exercises")
        print(f"🎬 Sample gifUrl: {data[0]['gifUrl']}")
        return data

    except requests.exceptions.HTTPError as e:
        print(f"❌ {response.status_code}: {response.text[:200]}")
        return {"error": str(response.status_code), "details": response.text[:200]}
    except Exception as e:
        print(f"❌ {str(e)}")
        return {"error": str(e)}