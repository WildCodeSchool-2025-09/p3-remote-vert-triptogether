import type { RequestHandler } from "express";
import budgetRepository from "../budget/budgetRepository";

const read: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.id);

    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }

    const budget = await budgetRepository.findExpenseByTrip(tripId);
    res.status(200).json(budget);
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const tripId = Number(req.params.id);
    const { title, amount, paid_by, category_id } = req.body;

    if (Number.isNaN(tripId)) {
      res.status(400).json({ error: "ID du voyage invalide" });
      return;
    }

    if (!title || !amount || !paid_by || !category_id) {
      res
        .status(400)
        .json({ error: "Titre, montant, contributeur, et catégorie requis" });
      return;
    }

    const budget = await budgetRepository.create(
      tripId,
      title,
      amount,
      paid_by,
      category_id,
    );

    res.status(201).json({
      id: budget,
      message: "Dépense ajoutée avec succès",
    });
  } catch (err) {
    next(err);
  }
};

const browse: RequestHandler = async (_req, res, next) => {
  try {
    const budgets = await budgetRepository.readAll();
    res.json(budgets);
  } catch (err) {
    next(err);
  }
};

export default { read, add, browse };
