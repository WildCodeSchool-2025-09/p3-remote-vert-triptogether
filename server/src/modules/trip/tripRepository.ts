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

  async isUserMemberOfTrip(tripId: number, userId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 1 
     FROM trip 
     WHERE id = ? AND user_id = ?
     UNION
     SELECT 1 
     FROM invitation 
     WHERE trip_id = ? AND user_id = ? AND status = "accepted"
     LIMIT 1`,
      [tripId, userId, tripId, userId],
    );
    return rows.length > 0;
  }

  async isOwner(tripId: number, userId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM trip WHERE id = ? AND user_id = ?",
      [tripId, userId],
    );

    return (rows as Trip[]).length > 0;
  }
}

export default new TripRepository();
