const express = require("express");
const router = express.Router();

import budgetActions from "../../modules/budget/budgetAction";
import expenseShareActions from "../../modules/expenseShare/expenseShareActions";

router.get("/:id/summary", budgetActions.getSummary);
router.get("/:id/budget", budgetActions.read);
router.post("/:id/shares", expenseShareActions.create);

router.get("/:id", budgetActions.getExpensesByTrip);
router.post("/:id", budgetActions.add);

export default router;
