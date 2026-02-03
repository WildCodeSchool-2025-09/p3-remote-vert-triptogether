const express = require("express");

const router = express.Router();

import invitationActions from "../../modules/invitation/invitationActions";
import tripActions from "../../modules/trip/tripActions";

router.get("/:id", tripActions.read);
router.post("/:id/invitations", invitationActions.add);

module.exports = router;
