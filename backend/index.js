const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Yashu@123",
  database: "Proton_code"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB error:", err);
    return;
  }
  console.log("✅ MySQL Connected");
});

// Serve GIF/image files
app.use("/gifs", express.static(path.join(__dirname, "gifs")));
app.use("/images", express.static(path.join(__dirname, "exercise_data")));

// Debug: see your DB column names
app.get("/api/debug", (req, res) => {
  db.query("DESCRIBE exercises", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Get ALL exercises (no limit)
app.get("/api/exercises", (req, res) => {
  db.query("SELECT * FROM exercises", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Filter by bodyPart or target muscle
app.get("/api/exercises/filter/:value", (req, res) => {
  const value = req.params.value;
  db.query(
    "SELECT * FROM exercises WHERE bodyPart = ? OR target = ?",
    [value, value],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});