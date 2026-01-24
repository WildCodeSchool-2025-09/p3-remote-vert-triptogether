import express from "express";

const router = express.Router();

import TripActions from "../../modules/trip/tripActions";
import VoteActions from "../../modules/vote/voteActions";

router.get("/", TripActions.browse);
router.get("/:id", TripActions.read);

router.post("/", TripActions.add);

router.post("/destinations/:id/votes", VoteActions.add);

// router.get("/destinations/:id/votes", VoteActions.read);

module.exports = router;
