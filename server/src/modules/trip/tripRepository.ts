import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Trip = {
  id: number;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  user_id: number;
};

class TripRepository {
  async create(trip: Omit<Trip, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO trip (title, description, start_at, end_at, user_id) VALUES (?, ?, ?, ?, ?)",
      [trip.title, trip.description, trip.start_at, trip.end_at, trip.user_id],
    );

    return result.insertId;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM trip WHERE id = ?",
      [id],
    );

    return rows[0] as Trip;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM trip");

    return rows as Trip[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing trip

  // async update(trip: Trip) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an trip by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new TripRepository();
