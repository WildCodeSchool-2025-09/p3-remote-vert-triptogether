import type { Request, RequestHandler } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

type MyPayload = {
  sub: string;
  isAdmin: boolean;
};

// Login
export const login: RequestHandler = async (req, res, next) => {
  try {
    const user = await userRepository.readByEmailWithPassword(req.body.email);

    if (!user) {
      res.sendStatus(422);
      return;
    }

    const verified = await argon2.verify(user.password, req.body.password);

    if (!verified) {
      res.sendStatus(422);
      return;
    }

    const { password: _, ...userWithoutHashedPassword } = user;

    const payload: MyPayload = {
      sub: user.id.toString(),
      isAdmin: user.is_admin,
    };

    const token = jwt.sign(payload, process.env.APP_SECRET as string, {
      expiresIn: "3h",
    });

    res.json({ token, user: userWithoutHashedPassword });
  } catch (err) {
    next(err);
  }
};

// Hash password middleware
export const hashPassword: RequestHandler = async (req, _res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19 * 1024,
      timeCost: 2,
      parallelism: 1,
    });

    req.body.hashed_password = hashedPassword;
    delete req.body.password;

    next();
  } catch (err) {
    next(err);
  }
};

// Verify JWT middleware
export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) throw new Error("Authorization header is missing");

    const [type, token] = authHeader.split(" ");
    if (type !== "Bearer") throw new Error("Authorization header must be Bearer");

    (req as any).auth = jwt.verify(token, process.env.APP_SECRET as string) as MyPayload;

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};