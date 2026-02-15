import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Expense = {
  id: number;
  trip_id: number;
  title: string;
  amount: number;
  date: string;
  paid_by: number;
  category: string;
};

type ExpenseShare = {
  id: number;
  expense_id: number;
  user_id: number;
  share_amount: number;
};

class budgetRepository {
  async findExpenseByTrip(tripId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM expense where  trip_id = ?",
      [tripId],
    );
    return rows[0] as Expense;
  }

  async create(
    tripId: number,
    title: string,
    amount: number,
    paid_by: number,
    category_id: number,
  ) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO expense (trip_Id, title, amount, paid_by, category_id) VALUES (?, ?, ?, ?, ?)",
      [tripId, title, amount, paid_by, category_id],
    );
    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("select * from expense");

    return rows as Expense[];
  }
}

export default new budgetRepository();
