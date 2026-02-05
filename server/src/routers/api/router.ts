import express, { type Request } from "express";
import invitationRouter from "../invitation/router";
import tripRouter from "../trip/router";
import userRouter from "../user/router";
import authRouter from "../auth/router";

const router = express.Router();

router.use("/auth", authRouter)

router.use("/invitation", invitationRouter);

router.use("/users", userRouter);

router.use("/trips", tripRouter);


export default router;
