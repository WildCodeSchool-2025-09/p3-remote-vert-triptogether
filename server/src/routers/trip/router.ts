import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";
import * as StepActions from "../../modules/step/stepActions";
import * as TripActions from "../../modules/trip/tripActions";

const router = express.Router();

router.get("/", TripActions.browse);
router.get("/countries", TripActions.browse);
router.get("/:id", TripActions.read);
router.post("/", verifyToken, TripActions.add);
router.delete("/:id", verifyToken, TripActions.delate);
router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);
router.get("/:tripId/steps", verifyToken, StepActions.selectStepsByTrip);
router.post("/:tripId/steps", verifyToken, StepActions.addStepCity);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);

router.patch("/:tripId/invitation/:id", invitationActions.edit);

export default router;
