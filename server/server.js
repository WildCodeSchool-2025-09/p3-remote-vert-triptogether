const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12531253",
  database: "trips_db",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err);
    return;
  }
  console.log("Connecté à la base MySQL");
});

app.get("/api/trips", (req, res) => {
  const query = "SELECT * FROM trips";

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
