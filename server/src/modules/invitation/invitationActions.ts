import type { RequestHandler } from "express";
import userRepository from "../user/userRepository";
import InvitationRepository from "./invitationRepository";

const CONNECTED_USER_ID = 11;

const read: RequestHandler = async (req, res, next) => {
  try {
    const invitationId = Number(req.params.id);
    const invitation = await InvitationRepository.select(invitationId);

    if (!invitation) {
      res.status(404).json({ error: "Invitation introuvable" });
      return;
    }

    if (
      ![invitation.creator_id, invitation.user_id].includes(CONNECTED_USER_ID)
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
      ![updateInvitation?.creator_id, updateInvitation?.user_id].includes(
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

    res.status(200).json();
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.id);
    const { email, message } = req.body;
    const existingUser = await userRepository.findByEmail(email);

    const user_id = existingUser ? existingUser.id : null;

    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID du voyage invalide" });
      return;
    }

    if (!email || !message) {
      res.status(400).json({ error: "Email et message requis" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Format email invalide" });
      return;
    }

    const creator_id = CONNECTED_USER_ID;

    const newInvitation = await InvitationRepository.create(
      tripId,
      email,
      message,
      creator_id,
      user_id,
    );

    res.status(201).json({ message: "Invitation envoyée" });
  } catch (err) {
    next(err);
  }
};

export default { edit, read, add };
