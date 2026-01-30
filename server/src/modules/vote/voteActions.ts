import type { RequestHandler } from "express";
import type { NewVote, VotesStats } from "../../types/voteType";
import voteRepository from "./voteRepository";

const add: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json();
    }
    const newVote: NewVote = {
      user_id: req.body.user_id || 1,
      step_id: Number.parseInt(req.params.id),
      vote: req.body.vote,
      comment: req.body.comment,
    };

    if (!newVote.user_id) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(newVote.step_id)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    if (typeof newVote.vote !== "boolean") {
      return res.status(400).json({ error: "Le vote doit être true ou false" });
    }

    if (newVote.comment !== null && typeof newVote.comment !== "string") {
      return res
        .status(400)
        .json({ error: "Le commentaire doit être une chaîne de caractères" });
    }

    const stepExists = await voteRepository.stepExists(newVote.step_id);
    if (!stepExists) {
      return res.status(404).json({ error: "Etape non trouvée" });
    }

    const isMemberOfTrip = await voteRepository.isUserMemberOfStepTrip(
      newVote.step_id,
      newVote.user_id,
    );
    if (!isMemberOfTrip) {
      return res
        .status(403)
        .json({ error: "Vous devez être membre du voyage pour voter" });
    }

    const hasVoted = await voteRepository.hasUserVoted(
      newVote.user_id,
      newVote.step_id,
    );
    if (hasVoted) {
      return res
        .status(409)
        .json({ error: "Vous avez déjà voté pour cette étape" });
    }

    const voteId = await voteRepository.create(
      newVote.user_id,
      newVote.step_id,
      newVote.vote,
      newVote.comment,
    );

    const createdVote = await voteRepository.selectByIdWithUser(voteId);

    return res.status(201).json(createdVote);
  } catch (err) {
    next(err);
  }
};

const browse: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json();
    }
    const step_id = Number.parseInt(req.params.id);
    const user_id = req.body.user_id || 1;

    if (!user_id) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(step_id)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    const isMemberOfTrip = await voteRepository.isUserMemberOfStepTrip(
      step_id,
      user_id,
    );
    if (!isMemberOfTrip) {
      return res.status(403).json({
        error: "Vous devez être membre du voyage pour voir les votes",
      });
    }

    const allVotes = await voteRepository.selectByStep(step_id);

    const votesStats: VotesStats = {
      step_id,
      allVotes,
      votesStats: {
        yes: allVotes.filter((v) => v.vote === true).length,
        no: allVotes.filter((v) => v.vote === false).length,
      },
    };

    return res.status(200).json(votesStats);
  } catch (err) {
    next(err);
  }
};

export default { add, browse };
