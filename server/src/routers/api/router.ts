import express, { type Request } from "express";
import {
  hashPassword,
  login,
  verifyToken,
} from "../../modules/auth/authActions";
import myTripActions from "../../modules/mytrip/mytripActions";
import {
  add as addUser,
  browse as browseUsers,
  read as readUser,
} from "../../modules/user/userActions";

import invitationRouter from "../invitation/router";
import tripRouter from "../trip/router";

// Type local pour la route protégée
type RequestWithAuth = Request & {
  auth: { sub: string; isAdmin: boolean };
};

const router = express.Router();

router.post("/login", login);
router.post("/users", hashPassword, addUser);

router.use(verifyToken);

router.get("/my-trips", myTripActions.browse);

router.use("/trips", tripRouter);
router.use("/invitation", invitationRouter);

router.get("/users", browseUsers);
router.get("/users/:id", readUser);

router.get("/protected", (req, res) => {
  const authReq = req as RequestWithAuth;
  res.json({
    message: "Connecté !",
    userId: authReq.auth.sub,
  });
});

export default router;
