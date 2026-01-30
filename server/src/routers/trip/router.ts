import express from "express";
import * as TripActions from "../../modules/trip/tripActions";
import { verifyToken } from "../../modules/auth/authActions";

const router = express.Router();

router.get("/", TripActions.browse);
router.get("/countries", TripActions.browse);
router.get("/:id", TripActions.read);
router.post("/", verifyToken, TripActions.add);

module.exports = router;