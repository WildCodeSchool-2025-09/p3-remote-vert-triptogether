import type { NextFunction, Request, Response } from "express";
import invitationRepository from "./invitationRepository";

const checkExpirationDate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await invitationRepository.read(invitationId);

    if (invitation && invitation.status === "pending" && invitation.start_at) {
      if (new Date() > new Date(invitation.start_at)) {
        return res.status(400).json({ error: "Invitation expirée" });
      }
    }

    next();
  } catch (err) {
    next(err);
  }
};

export default { checkExpirationDate };
