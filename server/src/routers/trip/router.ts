import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import * as TripActions from "../../modules/trip/tripActions";

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";


router.get("/", TripActions.browse);
router.get("/countries", TripActions.browse);
router.get("/:id", TripActions.read);
router.post("/", verifyToken, TripActions.add);

router.post("/", TripActions.add);

export default router;
router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:tripId/invitation/:id", invitationActions.edit);
module.exports = router;
