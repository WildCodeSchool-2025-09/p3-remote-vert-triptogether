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

class BudgetRepository {
  async findExpenseByTrip(tripId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM expense where  trip_id = ?",
      [tripId],
    );
    return rows as Expense[];
  }

  async findByTrip(tripId: number) {
    const [rows] = await databaseClient.query(
      "SELECT * FROM expense WHERE trip_id = ? ORDER BY id DESC",
      [tripId],
    );

    return rows;
  }

  async create(
    tripId: number,
    title: string,
    amount: number,
    paid_by: number,
    category_id: number,
  ) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO expense (trip_id, title, amount, paid_by, category_id) VALUES (?, ?, ?, ?, ?)",
      [tripId, title, amount, paid_by, category_id],
    );
    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("select * from expense");

    return rows as Expense[];
  }

  async sumTotalByTrip(tripId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT SUM(amount) as total FROM expense WHERE trip_id = ?",
      [tripId],
    );

    return Number(rows[0]?.total || 0);
  }

  async sumPaidByUser(tripId: number, userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT SUM(amount) as total FROM expense WHERE trip_id = ? AND paid_by = ?",
      [tripId, userId],
    );

    return Number(rows[0]?.total || 0);
  }
}

export default new BudgetRepository();
