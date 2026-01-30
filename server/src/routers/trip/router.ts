import express from "express";

const router = express.Router();

import TripActions from "../../modules/trip/tripActions";
import VoteActions from "../../modules/vote/voteActions";

router.get("/", TripActions.browse);
router.get("/:id", TripActions.read);

router.post("/", TripActions.add);

router.post("/steps/:id/votes", VoteActions.add);
router.get("/steps/:id/votes", VoteActions.browse);

module.exports = router;
