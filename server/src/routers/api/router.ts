import express from "express";

const router = express.Router();

const tripRouter = require("../trip/router");

router.use("/trip", tripRouter);

module.exports = router;
