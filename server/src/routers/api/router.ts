import express from "express";
import { login, hashPassword, verifyToken } from "../../modules/auth/authActions";
import { browse as browseUsers, read as readUser, add as addUser } from "../../modules/user/userActions";

const tripRouter = require("../trip/router");
const invitationRouter = require("../invitation/router");

const router = express.Router();

// Sous-routeurs
router.use("/trips", tripRouter);
router.use("/invitation", invitationRouter);

router.get("/users", browseUsers);
router.get("/users/:id", readUser);
router.post("/users", hashPassword, addUser);

router.post("/login", login);

router.use(verifyToken);

router.get("/protected", (req, res) => {
  res.json({ message: "Vous êtes connecté !", userId: (req as any).auth?.sub });
});
module.exports = router;