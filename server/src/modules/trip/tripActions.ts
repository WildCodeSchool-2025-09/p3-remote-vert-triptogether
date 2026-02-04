import type { Request, RequestHandler } from "express";
import type { Trip } from "../../types/tripType";
import * as googlePlacesService from "../auth/googlePlacesService";
import tripRepository from "./tripRepository";

type AuthRequest = Request & {
  auth: {
    sub: string;
    isAdmin: boolean;
  };
};

export const browse: RequestHandler = async (_req, res, next) => {
  try {
    const trips = await tripRepository.readAll();
    res.json(trips);
  } catch (err) {
    next(err);
  }
};
export const destroy: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const affectedRows = await tripRepository.delete(id);

    if (affectedRows === 0) {
      res.status(404).send("Voyage non trouvé");
    } else {
      res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
};
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

export const add: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;

  try {
    if (!authReq.auth) {
      res.status(401).json({ error: "Utilisateur non authentifié" });
      return;
    }

    const { title, description, city, country, start_at, end_at } = req.body;

    if (!title || !description || !city || !country || !start_at || !end_at) {
      res.status(400).json({ error: "Tous les champs sont obligatoires" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(start_at);
    const endDate = new Date(end_at);

    if (startDate < today) {
      res
        .status(400)
        .json({ error: "La date de départ ne peut pas être dans le passé" });
      return;
    }
    if (endDate <= startDate) {
      res
        .status(400)
        .json({ error: "La date de retour doit être après le départ" });
      return;
    }

    const imageUrl = await googlePlacesService.getCityImage(city, country);

    const newTrip: Trip = {
      title,
      description,
      city,
      country,
      start_at,
      end_at,
      user_id: Number(authReq.auth.sub),
      image_url: imageUrl || "/images/default-trip.jpg",
    };

    const insertId = await tripRepository.create(newTrip);

    res.status(201).json({
      insertId,
      message: "Voyage créé avec succès",
      image_url: newTrip.image_url,
    });
  } catch (err) {
    next(err);
  }
};
