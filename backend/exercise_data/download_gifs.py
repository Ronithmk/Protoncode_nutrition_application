import os
import requests
import json

# create folders
os.makedirs("gifs", exist_ok=True)

print("📥 Downloading exercise data...")

# use GitHub dataset JSON
json_url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"

response = requests.get(json_url)

if response.status_code != 200:
    print("❌ Failed to download JSON")
    exit()

exercises = response.json()

# save JSON
with open("exercises.json", "w") as f:
    json.dump(exercises, f, indent=2)

print(f"✅ Total exercises: {len(exercises)}")

print("📥 Downloading images...")

base_url = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises"

for ex in exercises:
    ex_id = ex.get("id")

    if not ex_id:
        continue

    img_url = f"{base_url}/{ex_id}/0.jpg"
    save_path = f"gifs/{ex_id}.jpg"

    try:
        r = requests.get(img_url, timeout=5)
        if r.status_code == 200:
            with open(save_path, "wb") as f:
                f.write(r.content)
            print(f"✅ {ex_id}")
        else:
            print(f"❌ {ex_id}")
    except:
        print(f"⚠️ {ex_id}")

print("🎉 DONE!")