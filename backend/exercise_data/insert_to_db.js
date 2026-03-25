const fs = require("fs");
const path = require("path");
const mysql = require("mysql2");

// read JSON safely
let data;
try {
  const filePath = path.join(__dirname, "exercises.json");
  data = JSON.parse(fs.readFileSync(filePath));
} catch (err) {
  console.log("❌ Failed to read JSON:", err.message);
  process.exit();
}

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Yashu@123",
  database: "Proton_code"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB Error:", err.message);
    return;
  }

  console.log("✅ Connected to MySQL");

  let success = 0;
  let failed = 0;

  data.forEach((ex, index) => {
    const query = `
      INSERT INTO exercises (id, name, bodyPart, target, equipment, image)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        name=VALUES(name),
        bodyPart=VALUES(bodyPart),
        target=VALUES(target),
        equipment=VALUES(equipment),
        image=VALUES(image)
    `;

    const imagePath = `/gifs/${ex.id}.jpg`;

    db.query(
      query,
      [
        ex.id,
        ex.name,
        ex.category || "general",   // ✅ FIXED
        ex.target || "unknown",
        ex.equipment || "unknown",
        imagePath
      ],
      (err) => {
        if (err) {
          console.log(`❌ Error ${ex.id}:`, err.message);
          failed++;
        } else {
          success++;
        }

        if (index === data.length - 1) {
          console.log("=================================");
          console.log("🎉 DONE!");
          console.log(`✅ Success: ${success}`);
          console.log(`❌ Failed: ${failed}`);
          console.log("=================================");
          db.end();
        }
      }
    );
  });
});