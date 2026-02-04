const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";
import tripActions from "../../modules/trip/tripActions";

router.get("/:id/info", tripActions.readTripInfo);
router.post("/:id/invitations", invitationActions.add);

router.get("/", tripActions.browse);
router.get("/:id", tripActions.read);

router.post("/", tripActions.add);

router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:tripId/invitation/:id", invitationActions.edit);

module.exports = router;
