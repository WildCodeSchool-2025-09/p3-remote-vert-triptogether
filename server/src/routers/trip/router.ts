import express from "express";

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

import stepActions from "../../modules/step/stepActions";
import TripActions from "../../modules/trip/tripActions";

router.get("/", TripActions.browse);
router.get("/:id", TripActions.read);

router.post("/", TripActions.add);

router.get("/:tripId/steps", stepActions.selectStepsByTrip);

router.get("/:tripId/steps/:id/votes", stepActions.browseVote);
router.post("/:tripId/steps/:id/votes", stepActions.addVote);

router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:tripId/invitation/:id", invitationActions.edit);

module.exports = router;
