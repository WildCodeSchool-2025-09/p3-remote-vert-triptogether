import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";
import stepActions from "../../modules/step/stepActions";
import TripActions from "../../modules/trip/tripActions";

const router = express.Router();

router.get("/info/:id", TripActions.read);
router.post("/:id/invitations", invitationActions.add);

router.get("/", TripActions.browse);
router.get("/:id", verifyToken, TripActions.browseMyTrip);

router.get("/:tripId/steps", stepActions.selectStepsByTrip);

router.get("/:tripId/steps/:id/votes", stepActions.browseVote);
router.post("/:tripId/steps/:id/votes", stepActions.addVote);

router.get("/countries", TripActions.browse);
router.post("/", verifyToken, TripActions.add);
router.delete("/:id", verifyToken, TripActions.delate);
router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);
router.get("/:tripId/steps", verifyToken, stepActions.selectStepsByTrip);
router.post("/:tripId/steps", verifyToken, stepActions.addStepCity);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);

router.patch("/:tripId/invitation/:id", invitationActions.edit);

export default router;
