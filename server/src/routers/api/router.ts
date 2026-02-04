import express from "express";

const router = express.Router();

const tripRouter = require("../trip/router");
const invitationRouter = require("../invitation/router");

router.use("/trips", tripRouter);
router.use("/invitation", invitationRouter);

/* ************************************************************************* */

module.exports = router;
