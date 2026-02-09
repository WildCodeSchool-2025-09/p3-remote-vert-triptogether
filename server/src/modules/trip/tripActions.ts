import type { RequestHandler } from "express";
import type { Trip } from "../../types/tripType";
import invitationRepository from "../invitation/invitationRepository";
import tripRepository from "./tripRepository";

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
      return;
    }

    const participants = await invitationRepository.readParticipate(tripId);

    res.json({ ...trip, participants });
  } catch (err) {
    next(err);
  }
};

const readTripInfo: RequestHandler = async (req, res, next) => {
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
    const newTrip: Trip = {
      title: req.body.title,
      description: req.body.description,
      city: req.body.city,
      country: req.body.country,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
      user_id: req.body.user_id || 1,
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
      res.status(400).json({
        error: "La date de retour doit être après la date de départ",
      });
      return;
    }

    const insertId = await tripRepository.create(newTrip);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, readTripInfo, add };
