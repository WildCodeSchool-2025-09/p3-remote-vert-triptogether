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

const CONNECTED_USER_ID = 3;

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
      res.status(400).json({
        error: "Invitation déjà accepté",
        trip_id: invitation.trip_id,
      });
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

const accept: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    if (Number.isNaN(invitationId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

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
      res.status(403).json({ error: "Seul l'invité peut accepter" });
      return;
    }

    const success = await InvitationRepository.updateStatus(
      invitationId,
      "accepted",
    );

    if (!success) {
      res.status(500).json({ error: "Erreur mise à jour" });
      return;
    }

    res.status(200).json({ message: "Invitation acceptée" });
  } catch (err) {
    next(err);
  }
};

const refuse: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    if (Number.isNaN(invitationId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

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
      res.status(403).json({ error: "Seul l'invité peut refuser" });
      return;
    }

    const success = await InvitationRepository.updateStatus(
      invitationId,
      "refused",
    );

    if (!success) {
      res.status(500).json({ error: "Erreur mise à jour" });
      return;
    }

    res.status(200).json({ message: "Invitation refusée" });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, accept, refuse };
