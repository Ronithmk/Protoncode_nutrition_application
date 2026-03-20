import os
import requests

os.makedirs("gifs", exist_ok=True)

for i in range(1, 200):
    url = f"https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{i}/0.jpg"
    path = f"gifs/{i}.jpg"

    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            with open(path, "wb") as f:
                f.write(r.content)
            print(f"✅ {i}")
        else:
            print(f"❌ {i}")
    except Exception as e:
        print(f"⚠️ {i} {e}")