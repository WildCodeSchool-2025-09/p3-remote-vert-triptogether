import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import * as TripActions from "../../modules/trip/tripActions";

const router = express.Router();

router.get("/", TripActions.browse);
router.get("/countries", TripActions.browse);
router.get("/:id", TripActions.read);
router.post("/", verifyToken, TripActions.add);

export default router;
