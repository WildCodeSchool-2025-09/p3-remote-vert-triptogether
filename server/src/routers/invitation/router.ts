const express = require("express");

const router = express.Router();

import InvitationActions from "../../modules/invitation/invitationActions";

router.get("/", InvitationActions.browse);
router.get("/:id", InvitationActions.read);

module.exports = router;
