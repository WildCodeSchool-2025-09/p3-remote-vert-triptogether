import express, { Request, Response } from "express";
import cors from "cors";
import mysql from "mysql2";

const app = express();

app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12531253",
  database: "trip_db", 
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion MySQL :", err.message);
    return;
  }
  console.log("Connecté à la base MySQL");
});


app.get("/api/trips", (req: Request, res: Response) => {
  const query = "SELECT * FROM trips";
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la récupération des voyages" });
    }
    res.json(results);
  });
});


app.post("/api/trips", (req: Request, res: Response) => {
  const { tripName, destination, startDate, endDate } = req.body;

  if (!tripName || !destination || !startDate || !endDate) {
    return res.status(400).json({ message: "Toutes les données sont requises" });
  }

  const query = "INSERT INTO trips (tripName, destination, startDate, endDate) VALUES (?, ?, ?, ?)";
  db.query(query, [tripName, destination, startDate, endDate], (err, result: any) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur lors de la création du voyage" });
    }
    res.status(201).json({ message: "Voyage créé avec succès", id: result.insertId });
  });
});

app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

export { app, db };
