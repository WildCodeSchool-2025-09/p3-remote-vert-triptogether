import type { RequestHandler } from "express";

import voteRepository from "./voteRepository";

type NewVote = {
  user_id: number;
  destination_id: number;
  vote: boolean;
  comment: string | null;
};

const add: RequestHandler = async (req, res, next) => {
  try {
    if (typeof req.params.id !== "string") {
      return res.status(400).json();
    }

    const newVote: NewVote = {
      user_id: req.body.user_id || 1,
      destination_id: Number.parseInt(req.params.id),
      vote: req.body.vote,
      comment: req.body.comment,
    };

    const destinationExists = await voteRepository.destinationExists(
      newVote.destination_id,
    );
    if (!destinationExists) {
      return res.status(404).json({ error: "Destination non trouvée" });
    }
  } catch (err) {
    next(err);
  }
};

export default { add };
