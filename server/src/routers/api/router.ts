import { tr } from "@faker-js/faker/.";
import express from "express";

const router = express.Router();

const tripRouter = require("../trip/router");

router.use("/trip", tripRouter);
router.use("/countries", tripRouter);
router.get("/future", (req, res) => {
  res.json([]);
});
router.get("/past", (req, res) => {
  res.json([]);
});

module.exports = router;
