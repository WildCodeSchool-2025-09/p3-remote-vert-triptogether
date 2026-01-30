import type { Request, RequestHandler } from "express";
import type { Trip } from "../../types/tripType";
import tripRepository from "./tripRepository";

type AuthRequest = Request & {
  auth: {
    sub: string;
    isAdmin: boolean;
  };
};

// Browse all trips
export const browse: RequestHandler = async (_req, res, next) => {
  try {
    const trips = await tripRepository.readAll();
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

// Read one trip
export const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const trip = await tripRepository.read(id);
    if (!trip) {
      res.sendStatus(404);
      return;
    }
    res.json(trip);
  } catch (err) {
    next(err);
  }
};

// Add trip (requires auth)
export const add: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.auth) {
      res.status(401).json({ error: "Non autorisé" });
      return;
    }

    const newTrip: Trip = {
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      country: req.body.country,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      user_id: Number(authReq.auth.sub),
    };

    if (
      !newTrip.title ||
      !newTrip.description ||
      !newTrip.city ||
      !newTrip.country ||
      !newTrip.start_at ||
      !newTrip.end_at
    ) {
      res.status(400).json({ error: "Toutes les données sont requises" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(newTrip.start_at);
    const endDate = new Date(newTrip.end_at);

    if (startDate < today) {
      res
        .status(400)
        .json({ error: "La date de départ ne peut pas être dans le passé" });
      return;
    }

    if (endDate <= startDate) {
      res
        .status(400)
        .json({ error: "La date de retour doit être après la date de départ" });
      return;
    }

    const insertId = await tripRepository.create(newTrip);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};
