const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  corscors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err);
    return;
  }
  console.log("Connecté à la base MySQL");
});

app.get("/api/trips", (req, res) => {
  const query = "SELECT * FROM trip";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des voyages" });
    }

    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
