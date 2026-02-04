import type { RequestHandler } from "express";
import type { NewVote, VotesStats } from "../../types/voteType";
import tripRepository from "../trip/tripRepository";
import stepRepository from "./stepRepository";

const selectStepsByTrip: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.tripId);
    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID de voyage invalide" });
      return;
    }

    const userId = req.body.user_id || 1;
    if (!userId) {
      return res.status(403).json({ error: "Non authentifié" });
    }

    const trip = await tripRepository.read(tripId);
    if (!trip) {
      res.status(404).json({ error: "Voyage introuvable" });
      return;
    }

    const isMemberOfTrip = await tripRepository.isUserMemberOfTrip(
      tripId,
      userId,
    );
    if (!isMemberOfTrip) {
      return res.status(403).json({
        error: "Vous devez être membre du voyage pour voir les étapes",
      });
    }

    const steps = await stepRepository.selectByTrip(tripId);

    return res.status(200).json({ steps });
  } catch (err) {
    next(err);
  }
};

const addVote: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json({ error: "Paramètre invalide" });
    }

    const stepId = Number.parseInt(req.params.id);
    const userId = req.body.user_id || 1;

    if (!userId) {
      return res.status(403).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(stepId)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    if (typeof req.body.vote !== "boolean") {
      return res.status(400).json({ error: "Le vote doit être true ou false" });
    }

    if (
      req.body.comment !== undefined &&
      req.body.comment !== null &&
      typeof req.body.comment !== "string"
    ) {
      return res.status(400).json({
        error: "Le commentaire doit être une chaîne de caractères",
      });
    }

    const step = await stepRepository.getStepWithTrip(stepId);
    if (!step) {
      return res.status(404).json({ error: "Etape non trouvée" });
    }

    const isMemberOfTrip = await tripRepository.isUserMemberOfTrip(
      step.trip_id,
      userId,
    );
    if (!isMemberOfTrip) {
      return res.status(403).json({
        error: "Vous devez être membre du voyage pour voter",
      });
    }

    const hasVoted = await stepRepository.hasUserVoted(userId, stepId);
    if (hasVoted) {
      return res.status(409).json({
        error: "Vous avez déjà voté pour cette étape",
      });
    }

    const newVote: NewVote = {
      user_id: userId,
      step_id: stepId,
      vote: req.body.vote,
      comment: req.body.comment || null,
    };

    const voteId = await stepRepository.create(
      newVote.user_id,
      newVote.step_id,
      newVote.vote,
      newVote.comment,
    );

    const createdVote = await stepRepository.selectByIdWithUser(voteId);

    return res.status(201).json(createdVote);
  } catch (err) {
    next(err);
  }
};

const browseVote: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json({ error: "Paramètre invalide" });
    }

    const stepId = Number.parseInt(req.params.id);
    const userId = req.body.user_id || 1;

    if (!userId) {
      return res.status(403).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(stepId)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    const step = await stepRepository.getStepWithTrip(stepId);
    if (!step) {
      return res.status(404).json({ error: "Etape non trouvée" });
    }

    const isMemberOfTrip = await tripRepository.isUserMemberOfTrip(
      step.trip_id,
      userId,
    );
    if (!isMemberOfTrip) {
      return res.status(403).json({
        error: "Vous devez être membre du voyage pour voir les votes",
      });
    }

    const allVotes = await stepRepository.selectByStep(stepId);

    const voteStats: VotesStats = {
      step_id: stepId,
      allVotes,
      voteStats: {
        yes: allVotes.filter((v) => v.vote === 1).length,
        no: allVotes.filter((v) => v.vote === 0).length,
      },
    };

    return res.status(200).json(voteStats);
  } catch (err) {
    next(err);
  }
};

export default { selectStepsByTrip, addVote, browseVote };
