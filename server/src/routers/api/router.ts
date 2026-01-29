import express from "express";
import type { RequestHandler } from "express";
import invitationActions from "../../modules/invitation/invitationActions";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define trip-related routes
const invitationRouter = require("../invitation/router");

router.use("/invitation", invitationRouter);
router.delete("/trip/:tripId/:userId", invitationActions.removeMember);
/* ************************************************************************* */

module.exports = router;
