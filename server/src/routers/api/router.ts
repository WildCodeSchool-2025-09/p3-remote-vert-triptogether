import express from "express";

const router = express.Router();

const tripRouter = require("../trip/router");

router.use("/trips", tripRouter);

module.exports = router;
