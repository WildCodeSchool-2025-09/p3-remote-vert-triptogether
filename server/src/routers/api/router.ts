import express from "express";

const router = express.Router();

const invitationRouter = require("../invitation/router");
const tripRouter = require("../trip/router");

router.use("/invitation", invitationRouter);
router.use("/trip", tripRouter);

module.exports = router;
