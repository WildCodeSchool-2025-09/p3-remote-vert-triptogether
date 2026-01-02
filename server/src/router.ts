import express from "express";
import type { RequestHandler } from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define trip-related routes
import tripActions from "./modules/trip/tripActions";

const foo: RequestHandler = (req, res, next) => {
  req.message = "hello middleware";

  next();
};

router.get("/api/trips", foo, tripActions.browse);
router.get("/api/trip/:id", tripActions.read);
router.post("/api/trip", tripActions.add);

import userActions from "./modules/user/userActions";

router.get("/api/users", foo, userActions.browse);
router.get("/api/user/:id", userActions.read);
router.post("/api/user", userActions.add);

/* ************************************************************************* */

export default router;
