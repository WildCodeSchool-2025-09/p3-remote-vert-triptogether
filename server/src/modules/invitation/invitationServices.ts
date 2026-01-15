import type { NextFunction, Request, Response } from "express";
import invitationRepository from "./invitationRepository";

const checkExpirationDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await invitationRepository.readTrip(invitationId);

    if (
      invitation &&
      invitation.status === "pending" &&
      invitation.trip_start
    ) {
      if (new Date() > new Date(invitation.trip_start)) {
        return res.status(400).json({ error: "Invitation expirée" });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default { checkExpirationDate };
