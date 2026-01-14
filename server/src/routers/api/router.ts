import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define trip-related routes
const invitationRouter = require("../invitation/router");

router.use("/invitation", invitationRouter);

/* ************************************************************************* */

module.exports = router;
