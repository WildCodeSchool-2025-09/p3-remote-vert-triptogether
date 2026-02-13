import express from "express";
import { verifyToken } from "../../modules/auth/authActions";

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

router.get(
  "/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:id", verifyToken, invitationActions.edit);

router.delete("/:tripId/:userId", verifyToken, invitationActions.delate);

export default router;
