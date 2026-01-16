const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

router.get("/", invitationActions.browse);
router.get(
  "/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);

router.post("/", invitationActions.add);
router.patch("/:id/accept", invitationActions.accept);
router.patch("/:id/refuse", invitationActions.refuse);

module.exports = router;
