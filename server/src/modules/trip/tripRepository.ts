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
  async readTripInfo(id: number): Promise<Trip | null> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT t.id, t.title, t.start_at, t.end_at, d.city, d.country, COUNT(i.id) AS participants 
      FROM trip t 
      JOIN destination d ON d.trip_id = t.id 
      JOIN invitation i ON i.trip_id = t.id AND i.status = "accepted" 
      WHERE t.id = ? 
      GROUP BY t.id, d.id`,
      [id],
    );

    if (rows.length === 0) return null;

    return rows[0] as Trip;
  }
  async read(id: number): Promise<Trip | null> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
      t.*,
      u.firstname AS owner_firstname,
      u.lastname  AS owner_lastname
      FROM trip t
      JOIN user u ON u.id = t.user_id
      WHERE t.id = ?`,
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

  async isOwner(tripId: number, userId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM trip WHERE id = ? AND user_id = ?",
      [tripId, userId],
    );

    return rows.length > 0;
  }

  async readByUser(userId: number, status: string) {
    let dateCondition = "";

    if (status === "futur") {
      dateCondition = "AND start_at > NOW()";
    } else if (status === "current") {
      dateCondition = "AND start_at <= NOW() AND end_at >= NOW()";
    } else if (status === "past") {
      dateCondition = "AND end_at < NOW()";
    }

    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM trip WHERE user_id = ? ${dateCondition} ORDER BY start_at ASC`,
      [userId],
    );
    return rows as Trip[];
  }
}

export default new TripRepository();
