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

    if (invitation.status === "accepted") {
      res.status(200).json({
        status: "already_accepted",
        message: "Invitation déjà acceptée",
        trip_id: invitation.trip_id,
      });
      return;
    }

    if (invitation.status === "refused") {
      res.status(200).json({
        status: "already_refused",
        message: "Invitation déjà refusée",
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

const edit: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.select(invitationId);

    if (Number.isNaN(invitationId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const updateInvitation = await InvitationRepository.select(invitationId);
    if (!invitation) {
      res.status(404).json({ error: "Invitation introuvable" });
      return;
    }

    if (updateInvitation?.status === "accepted") {
      res.status(200).json({
        status: "already_accepted",
        message: "Invitation déjà acceptée",
        trip_id: invitation.trip_id,
      });
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

    res.status(200).json({
      message: "Mise à jour de l'invitation effectuée",
      trip_id: invitation.trip_id,
    });
  } catch (err) {
    next(err);
  }
};

export default { edit, read };
