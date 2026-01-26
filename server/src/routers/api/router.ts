import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define trip-related routes
const invitationRouter = require("../invitation/router");
const tripRouter = require("../trip/router");

router.use("/invitation", invitationRouter);
router.use("/trips", tripRouter);

/* ************************************************************************* */

module.exports = router;
