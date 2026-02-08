import type { RequestHandler } from "express";
import Joi from "joi";
import type { VotesStats } from "../../types/voteType";
import tripRepository from "../trip/tripRepository";
import stepRepository from "./stepRepository";

const createVoteSchema = Joi.object({
  user_id: Joi.number().required(),
  vote: Joi.boolean().required(),
  comment: Joi.string().max(500).allow(null, "").optional(),
});

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
    const stepId = Number(req.params.id);

    const { error, value } = createVoteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const { user_id, vote, comment } = value;
    const userId = user_id || 1;

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
        error: "Vous devez être membre du voyage pour voter",
      });
    }

    const hasVoted = await stepRepository.hasUserVoted(userId, stepId);
    if (hasVoted) {
      return res.status(409).json({
        error: "Vous avez déjà voté pour cette étape",
      });
    }

    const voteId = await stepRepository.create(
      userId,
      stepId,
      vote,
      comment || null,
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
        yes: allVotes.filter((v) => v.vote === true).length,
        no: allVotes.filter((v) => v.vote === false).length,
      },
    };

    return res.status(200).json(voteStats);
  } catch (err) {
    next(err);
  }
};

export default { selectStepsByTrip, addVote, browseVote };
