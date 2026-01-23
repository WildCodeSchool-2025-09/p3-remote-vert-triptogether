import type { RequestHandler } from "express";

import tripRepository from "./tripRepository";

type NewTrip = {
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  user_id: number;
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    const trips = await tripRepository.readAll();

    res.json(trips);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.id);
    const trip = await tripRepository.read(tripId);

    if (trip == null) {
      res.sendStatus(404);
    } else {
      res.json(trip);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newTrip: NewTrip = {
      title: req.body.title,
      description: req.body.description,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      user_id: req.body.user_id || 1,
    };

    if (
      !newTrip.title ||
      !newTrip.description ||
      !newTrip.start_at ||
      !newTrip.end_at
    ) {
      res.status(400).json({ message: "Toutes les données sont requises" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(newTrip.start_at);
    const endDate = new Date(newTrip.end_at);

    if (startDate < today) {
      res
        .status(400)
        .json({ message: "La date de départ ne peut pas être dans le passé" });
      return;
    }

    if (endDate <= startDate) {
      res.status(400).json({
        message: "La date de retour doit être après la date de départ",
      });
      return;
    }

    const insertId = await tripRepository.create(newTrip);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
