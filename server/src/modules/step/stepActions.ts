import type { RequestHandler } from "express";
import type { NewVote, VotesStats } from "../../types/voteType";
import * as googlePlacesService from "../services/googlePlacesService";
import tripRepository from "../trip/tripRepository";
import stepRepository from "./stepRepository";

type AuthRequest = import("express").Request & {
  auth: {
    sub: string;
    isAdmin: boolean;
  };
};

const selectStepsByTrip: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthRequest;
  try {
    const tripId = Number(req.params.tripId);
    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID de voyage invalide" });
      return;
    }

    const userId = Number(authReq.auth?.sub);
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

    const steps = await stepRepository.selectByTrip(tripId, userId);

    return res.status(200).json({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        city: trip.city,
        country: trip.country,
        image_url: trip.image_url,
      },
      steps,
    });
  } catch (err) {
    next(err);
  }
};
const addStepCity: RequestHandler = async (req, res, next) => {
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
        error: "Vous devez être membre du voyage pour ajouter une étape",
      });
    }

    const { city, country, image_url } = req.body;
    let finalImageUrl = image_url;

    if (!finalImageUrl) {
      finalImageUrl = await googlePlacesService.getCityImage(city, country);
    }

    if (typeof city !== "string" || typeof country !== "string") {
      return res
        .status(400)
        .json({ error: "La ville et le pays sont requis." });
    }

    const stepId = await stepRepository.createStepCity({
      trip_id: tripId,
      city,
      country,
      image_url: finalImageUrl || "/images/default-trip.jpg",
    });

    return res.status(201).json({
      trip: {
        id: trip.id,
        title: trip.title,
        description: trip.description,
        city: trip.city,
        country: trip.country,
        image_url: trip.image_url,
      },
      stepId,
    });
  } catch (err) {
    next(err);
  }
};

const addVote: RequestHandler = async (req, res, next) => {
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
      return res.status(403).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(newVote.step_id)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    if (typeof newVote.vote !== "boolean") {
      return res.status(400).json({ error: "Le vote doit être true ou false" });
    }

    if (
      newVote.comment !== undefined &&
      newVote.comment !== null &&
      typeof newVote.comment !== "string"
    ) {
      return res
        .status(400)
        .json({ error: "Le commentaire doit être une chaîne de caractères" });
    }

    const stepExists = await stepRepository.stepExists(newVote.step_id);
    if (!stepExists) {
      return res.status(404).json({ error: "Etape non trouvée" });
    }

    const isMemberOfTrip = await tripRepository.isUserMemberOfTrip(
      newVote.step_id,
      newVote.user_id,
    );
    if (!isMemberOfTrip) {
      return res
        .status(403)
        .json({ error: "Vous devez être membre du voyage pour voter" });
    }

    const hasVoted = await stepRepository.hasUserVoted(
      newVote.user_id,
      newVote.step_id,
    );
    if (hasVoted) {
      return res
        .status(409)
        .json({ error: "Vous avez déjà voté pour cette étape" });
    }

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
      return res.status(400).json();
    }
    const step_id = Number.parseInt(req.params.id);
    const user_id = req.body.user_id || 1;

    if (!user_id) {
      return res.status(403).json({ error: "Non authentifié" });
    }

    if (Number.isNaN(step_id)) {
      return res.status(400).json({ error: "ID d'étape invalide" });
    }

    const isMemberOfTrip = await tripRepository.isUserMemberOfTrip(
      step_id,
      user_id,
    );
    if (!isMemberOfTrip) {
      return res.status(403).json({
        error: "Vous devez être membre du voyage pour voir les votes",
      });
    }

    const allVotes = await stepRepository.selectByStep(step_id);

    const voteStats: VotesStats = {
      step_id,
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

export { selectStepsByTrip, addVote, browseVote, addStepCity };
