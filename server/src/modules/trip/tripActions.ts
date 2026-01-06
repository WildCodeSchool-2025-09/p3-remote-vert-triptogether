import type { RequestHandler } from "express";

// Import access to data
import tripRepository from "./tripRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all trips
    const trips = await tripRepository.readAll();

    // Respond with the trips in JSON format
    res.json(trips);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific trip based on the provided ID
    const tripId = Number(req.params.id);
    const trip = await tripRepository.read(tripId);

    // If the trip is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the trip in JSON format
    if (trip == null) {
      res.sendStatus(404);
    } else {
      res.json(trip);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the trip data from the request body
    const newTrip = {
      title: req.body.title,
      user_id: req.body.user_id,
      description: req.body.description,
      start_at: req.body.start_at,
      end_at: req.body.end_at,
    };

    // Create the trip
    const insertId = await tripRepository.create(newTrip);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted trip
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add };
