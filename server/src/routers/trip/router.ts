const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

import TripActions from "../../modules/trip/tripActions";

router.get("/", TripActions.browse);
router.get("/:id", TripActions.read);

router.post("/", TripActions.add);

router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:tripId/invitation/:id", invitationActions.edit);
module.exports = router;
