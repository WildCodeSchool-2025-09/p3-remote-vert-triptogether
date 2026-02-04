import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Trip } from "../../types/tripType";

class TripRepository {
  async create(trip: Omit<Trip, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO trip (title, description, city, country, start_at, end_at, user_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        trip.title,
        trip.description,
        trip.city,
        trip.country,
        trip.start_at,
        trip.end_at,
        trip.user_id,
        trip.image_url,
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

  async update(trip: Trip) {
    const [result] = await databaseClient.query<Result>(
      `UPDATE trip 
       SET title = ?, description = ?, city = ?, country = ?, start_at = ?, end_at = ?, image_url = ? 
       WHERE id = ?`,
      [
        trip.title,
        trip.description,
        trip.city,
        trip.country,
        trip.start_at,
        trip.end_at,
        trip.image_url,
        trip.id,
      ],
    );

    return result.affectedRows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM trip WHERE id = ?",
      [id],
    );

    return result.affectedRows;
  }
}

export default new TripRepository();
