import type { RequestHandler } from "express";

// Import access to data
import InvitationRepository from "./invitationRepository";

type newinvitation = {
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  trip_id: number;
};

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all invitations
    const invitations = await InvitationRepository.readAll();

    // Respond with the invitations in JSON format
    res.json(invitations);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific invitation based on the provided ID
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.read(invitationId);

    // If the invitation is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the invitation in JSON format
    if (invitation == null) {
      res.sendStatus(404);
    } else {
      res.json(invitation);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the invitation data from the request body
    const newinvitation: newinvitation = {
      status: req.body.status,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
      user_id: req.body.user_id,
      trip_id: req.body.trip_id,
    };

    // Create the invitation
    const insertId = await InvitationRepository.create(newinvitation);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted invitation
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add };
