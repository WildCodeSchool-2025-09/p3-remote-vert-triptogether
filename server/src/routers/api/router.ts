import { tr } from "@faker-js/faker/.";
import express from "express";

const router = express.Router();

const tripRouter = require("../trip/router");
const invitationRouter = require("../invitation/router");

router.use("/trips", tripRouter);
router.use("/invitation", invitationRouter);

// Define user-related routes
import userActions from "../../modules/user/userActions";

router.get("/users", userActions.browse);
router.get("/users/:id", userActions.read);

// Define auth-related routes
import authActions from "../../modules/auth/authActions";

router.post("/login", authActions.login);

router.post("/users", authActions.hashPassword, userActions.add);

// Authentication wall
router.use(authActions.verifyToken);

module.exports = router;
