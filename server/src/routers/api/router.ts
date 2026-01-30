import express from "express";

const router = express.Router();

const invitationRouter = require("../invitation/router");
const tripRouter = require("../trip/router");

router.use("/trips", tripRouter);
router.use("/invitation", invitationRouter);

module.exports = router;
