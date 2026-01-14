const express = require("express");

const router = express.Router();

import InvitationActions from "../../modules/invitation/invitationActions";
import { checkDate } from "../../modules/invitation/invitationService";

router.get("/", InvitationActions.browse);
router.get("/:id", checkDate, InvitationActions.read);

module.exports = router;
