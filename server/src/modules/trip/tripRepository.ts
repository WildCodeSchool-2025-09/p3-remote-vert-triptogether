import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Trip } from "../../types/tripType";

class TripRepository {
  async create(trip: Omit<Trip, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO trip (title, description,city, country, start_at, end_at, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        trip.title,
        trip.description,
        trip.city,
        trip.country,
        trip.start_at,
        trip.end_at,
        trip.user_id,
      ],
    );

    return result.insertId;
  }

  async read(id: number): Promise<Trip | null> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        t.*,
        u.firstname AS owner_firstname,
        u.lastname  AS owner_lastname
      FROM trip t
      JOIN user u ON u.id = t.user_id
      WHERE t.id = ?
      `,
      [id],
    );

    if (rows.length === 0) return null;

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
