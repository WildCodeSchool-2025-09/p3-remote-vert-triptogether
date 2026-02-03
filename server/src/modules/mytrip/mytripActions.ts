import type { RequestHandler } from "express";
import type { Trip, TripStatus } from "../../types/tripType";
import mytripRepository from "./mytripRepository";
interface RequestWithAuth extends Request {
  auth: {
    sub: string;
    isAdmin: boolean;
  };
}

const browse: RequestHandler = async (req, res, next) => {
  try {
    const authReq = req as unknown as RequestWithAuth;
    const userId = Number(authReq.auth.sub);
    const status = (req.query.status as TripStatus) || "futur";
    console.log("Détails requête:", { userId, status });
    const trips = await mytripRepository.selectByUserId(userId, status);
    res.json(trips);
  } catch (err) {
    next(err);
  }
};

export default { browse };
