import express from "express";
import { verifyToken } from "../../modules/auth/authActions";
import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";
import tripActions from "../../modules/trip/tripActions";

const router = express.Router();

router.get("/info/:id", tripActions.read);
router.post("/:id/invitations", invitationActions.add);

router.get("/", tripActions.browse);
router.get("/:id", tripActions.browseMyTrip);

router.get("/countries", tripActions.browse);
router.post("/", verifyToken, tripActions.add);
router.delete("/:id", verifyToken, tripActions.delate);
router.get("/:id/invitations", invitationActions.selectInvitationsByTrip);

router.get(
  "/:tripId/invitation/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);

router.patch("/:tripId/invitation/:id", invitationActions.edit);

export default router;
