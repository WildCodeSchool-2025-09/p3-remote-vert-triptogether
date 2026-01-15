import type { RequestHandler } from "express";

import InvitationRepository from "./invitationRepository";

type NewInvitation = {
  status: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  invited_id: number;
  trip_id: number;
};

const CONNECTED_USER_ID = 2;

const browse: RequestHandler = async (req, res, next) => {
  try {
    const invitations = await InvitationRepository.readAll();

    res.json(invitations);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.readWithDetails(invitationId);

    if (!invitation) {
      res.sendStatus(404).json({ error: "Invitation introuvable" });
      return;
    }

    if (invitation.status === "accepted") {
      res.status(400).json({ error: "Invitation déjà accepté" });
      return;
    }

    if (
      ![invitation.creator_id, invitation.invited_id].includes(
        CONNECTED_USER_ID,
      )
    ) {
      res.status(403).json({ error: "Accès non autorisé" });
      return;
    }

    res.json(invitation);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newinvitation: NewInvitation = {
      status: req.body.status,
      created_at: req.body.created_at,
      updated_at: req.body.updated_at,
      creator_id: req.body.creator_id,
      invited_id: req.body.invited_id,
      trip_id: req.body.trip_id,
    };

    const insertId = await InvitationRepository.create(newinvitation);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.readWithDetails(invitationId);

    if (!invitation) {
      res.status(404).json({ error: "Invitation introuvable" });
      return;
    }

    if (invitation.status === "accepted") {
      res.status(400).json({ error: "Invitation déjà acceptée" });
      return;
    }

    if (
      ![invitation.creator_id, invitation.invited_id].includes(
        CONNECTED_USER_ID,
      )
    ) {
      res.status(403).json({ error: "Accès non autorisé" });
      return;
    }

    if (invitation.creator_id === CONNECTED_USER_ID) {
      res.status(403).json({ error: "Seul l'invité peut répondre" });
      return;
    }

    const newStatus = req.body.status;
    if (!["accepted", "refused"].includes(newStatus)) {
      res
        .status(400)
        .json({ error: "Status doit être 'accepted' ou 'refused'" });
      return;
    }

    const success = await InvitationRepository.update(invitationId, {
      status: newStatus,
    });

    if (!success) {
      res.status(500).json({ error: "Erreur mise à jour" });
      return;
    }

    res.status(200).json({ message: `Invitation ${newStatus}` });
  } catch (err) {
    next(err);
  }
};
export default { browse, read, add, update };
