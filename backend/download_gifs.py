import os
import requests
import json

API_KEY = "3384820908msh4410329c17bc93ep141a50jsn705166746724"

os.makedirs("gifs", exist_ok=True)

# ✅ Correct endpoint with limit
url = "https://exercisedb.p.rapidapi.com/exercises?limit=1000"


headers = {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "exercisedb.p.rapidapi.com"
}

print("📥 Downloading exercise data...")
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print("❌ API Error:", response.text)
    exit()

exercises = response.json()

# ✅ Debug first item (optional)
print("🔍 Sample data:", exercises[0])

# Save JSON
with open("exercises.json", "w") as f:
    json.dump(exercises, f, indent=2)

print(f"✅ Total exercises: {len(exercises)}")

print("📥 Downloading GIFs...")

for ex in exercises:
    # ✅ Handle different key names
    gif_url = ex.get("gifUrl") or ex.get("gif_url")
    ex_id = ex.get("id") or ex.get("exerciseId")

    if not gif_url or not ex_id:
        print("❌ Skipping invalid item")
        continue

    try:
        r = requests.get(gif_url, timeout=10)
        if r.status_code == 200:
            with open(f"gifs/{ex_id}.gif", "wb") as f:
                f.write(r.content)
            print(f"✅ {ex_id}")
        else:
            print(f"❌ {ex_id}")
    except Exception as e:
        print(f"⚠️ {ex_id} {e}")

print("🎉 DONE!")