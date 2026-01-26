import type { RequestHandler } from "express";
import InvitationRepository from "./invitationRepository";

const CONNECTED_USER_ID = 3;

const read: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.select(invitationId);

    if (!invitation) {
      res.status(404).json({ error: "Invitation introuvable" });
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

    if (invitation.status === "accepted") {
      res.status(409).json({
        message: "Invitation déjà acceptée",
        trip_id: invitation.trip_id,
      });
      return;
    }

    if (invitation.status === "refused") {
      res.status(410).json({
        message: "Invitation déjà refusée",
      });
      return;
    }

    res.json(invitation);
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const updateInvitation = await InvitationRepository.select(invitationId);

    if (Number.isNaN(invitationId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    if (!updateInvitation) {
      res.status(404).json({ error: "Invitation introuvable" });
      return;
    }

    if (
      ![updateInvitation?.creator_id, updateInvitation?.invited_id].includes(
        CONNECTED_USER_ID,
      )
    ) {
      res.status(403).json({ error: "Accès non autorisé" });
      return;
    }

    if (updateInvitation?.creator_id === CONNECTED_USER_ID) {
      res.status(403).json({ error: "Seul l'invité peut accepter" });
      return;
    }

    const success = await InvitationRepository.updateStatus(
      invitationId,
      req.body.status,
    );

    if (!success) {
      res.status(500).json({ error: "Erreur mise à jour" });
      return;
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

const listByTrip: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId);

    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID de voyage invalide" });
      return;
    }

    const invitations = await InvitationRepository.findByTripId(tripId);

    if (invitations.length === 0) {
      res.status(404).json({ error: "Aucune invitation pour ce voyage" });
      return;
    }

    const isAllowed = invitations.some(
      (invitation) =>
        invitation.creator_id === CONNECTED_USER_ID ||
        (invitation.invited_id === CONNECTED_USER_ID &&
          invitation.status === "accepted"),
    );

    if (!isAllowed) {
      res.sendStatus(403);
      return;
    }

    res.json(invitations);
  } catch (err) {
    next(err);
  }
};

export default { edit, read, listByTrip };
