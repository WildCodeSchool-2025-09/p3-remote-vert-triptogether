import type { RequestHandler } from "express";
import Joi from "joi";
import type { StepWithStatus, VotesStats } from "../../types/voteType";
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

    const steps = await stepRepository.getStepsWithVotes(tripId);

    const stepsWithStatus: StepWithStatus[] = steps.map((step) => {
      const yesVotes = step.yes_votes;
      const totalVotes = step.total_votes;
      const memberCount = step.total_members;

      const everyoneVoted = totalVotes === memberCount;
      const majorityYes = yesVotes > memberCount / 2;

      let status: "pending" | "validated" | "rejected" = "pending";

      if (everyoneVoted) {
        status = majorityYes ? "validated" : "rejected";
      }

      return {
        id: step.id,
        city: step.city,
        country: step.country,
        // creator_name: step.creator_name,
        trip_id: step.trip_id,
        status,
        voteStats: {
          yes: yesVotes,
          no: totalVotes - yesVotes,
          total: totalVotes,
        },
      };
    });

    return res.status(200).json({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        memberCount: steps[0]?.total_members ?? 0,
      },
      steps: stepsWithStatus,
    });
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

    const yes = allVotes.filter((v) => v.vote).length;
    const no = allVotes.filter((v) => !v.vote).length;

    const showVoteStats: VotesStats = {
      step_id: stepId,
      allVotes,
      summary: {
        yes,
        no,
        total: allVotes.length,
      },
    };

    return res.status(200).json(showVoteStats);
  } catch (err) {
    next(err);
  }
};

export default { selectStepsByTrip, addVote, browseVote };
