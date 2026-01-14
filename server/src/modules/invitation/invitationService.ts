import type { NextFunction, Request, Response } from "express";
import invitationRepository from "./invitationRepository";

export const checkDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await invitationRepository.readTrip(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: "Invitation introuvable" });
    }

    if (invitation.status === "accepted") {
      return res.status(400).json({ error: "Invitation déjà accepté" });
    }

    const now = new Date();
    const start_at = new Date(invitation.trip_start);
    if (start_at < now) {
      return res.status(400).json({ error: "Cette invitation a expiré" });
    }

    next();
  } catch (err) {
    next(err);
  }
};
