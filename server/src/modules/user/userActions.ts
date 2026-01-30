import type { RequestHandler } from "express";
import userRepository from "./userRepository";

// Browse all users
export const browse: RequestHandler = async (_req, res, next) => {
  try {
    const users = await userRepository.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Read one user
export const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await userRepository.read(id);

    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Add user
export const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      email: req.body.email,
      password: req.body.hashed_password,
      is_admin: req.body.is_admin || false,
    };

    const insertId = await userRepository.create(newUser);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};