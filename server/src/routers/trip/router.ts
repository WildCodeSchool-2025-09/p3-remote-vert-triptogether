import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import * as TripActions from "../../modules/trip/tripActions";
import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

const router = express.Router();

router.get("/", TripActions.browse);
router.get("/countries", TripActions.browse);
router.get("/:id", TripActions.read);
router.post("/", verifyToken, TripActions.add);

router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read
);

router.patch("/:tripId/invitation/:id", invitationActions.edit);

export default router;