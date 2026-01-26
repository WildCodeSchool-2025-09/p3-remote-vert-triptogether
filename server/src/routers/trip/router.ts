const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";

router.post("/:id/invitations", invitationActions.add);

module.exports = router;
