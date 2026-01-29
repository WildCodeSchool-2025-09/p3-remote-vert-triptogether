const express = require("express");

const router = express.Router();

import TripActions from "../../modules/trip/tripActions";

router.get("/", TripActions.browse);
router.get("/:id", TripActions.read);

router.post("/", TripActions.add);

module.exports = router;
