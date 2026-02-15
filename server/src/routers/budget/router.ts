const express = require("express");
const router = express.Router();

import budgetActions from "../../modules/budget/budgetAction";

router.get("/:id", budgetActions.read);
router.post("/:id", budgetActions.add);
router.get("/", budgetActions.browse);

export default router;
