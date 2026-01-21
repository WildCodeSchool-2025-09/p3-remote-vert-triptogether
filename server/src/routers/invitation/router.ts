const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import invitationServices from "../../modules/invitation/invitationServices";

router.get(
  "/:id",
  invitationServices.checkExpirationDate,
  invitationActions.read,
);
router.patch("/:id", invitationActions.edit);

module.exports = router;
