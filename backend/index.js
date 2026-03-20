const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "3384820908msh4410329c17bc93ep141a50jsn705166746724";

app.get("/api/gif-proxy", async (req, res) => {
  const { url } = req.query;
  if (!url || url === "undefined") {
    return res.status(400).send("Invalid URL");
  }
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
        "Accept": "image/gif,image/*,*/*"
      },
      timeout: 10000
    });
    res.set("Content-Type", response.headers["content-type"] || "image/gif");
    res.send(response.data);
  } catch (err) {
    console.error("GIF proxy error:", err.message, "URL:", url);
    res.status(500).send("Failed to load GIF");
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));