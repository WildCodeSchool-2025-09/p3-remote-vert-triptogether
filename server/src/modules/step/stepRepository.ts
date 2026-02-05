import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { VoteWithUser } from "../../types/voteType";
import type { Step } from "../../types/tripType";

class stepRepository {
  async selectByTrip(tripId: number, userId: number): Promise<Step[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT id, city, country, trip_id, image_url
        FROM step
        WHERE trip_id = ?`,
      [tripId]
    );
    return rows as Step[];
  }
  async createStepCity(step: Omit<Step, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO step (city, country, trip_id, image_url) VALUES (?, ?, ?, ?)",
      [
        step.city,
        step.country,
        step.trip_id,
        step.image_url,
      ],
    );
    return result.insertId;
  } 
  async stepExists(stepId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM step WHERE id = ?",
      [stepId],
    );
    return rows.length > 0;
  }
   
  async hasUserVoted(userId: number, stepId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM vote WHERE user_id = ? AND step_id = ?",
      [userId, stepId],
    );
    return rows.length > 0;
  }

  async create(
    userId: number,
    stepId: number,
    vote: boolean,
    comment: string | null,
  ): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO vote (user_id, step_id, vote, comment) 
        VALUES (?, ?, ?, ?)`,
      [userId, stepId, vote, comment],
    );
    return result.insertId;
  }

  async selectByIdWithUser(voteId: number): Promise<VoteWithUser | null> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT v.*, u.name as user_name
        FROM vote AS v
        JOIN user AS u ON v.user_id = u.id
        WHERE v.id = ?`,
      [voteId],
    );
    return rows.length > 0 ? (rows[0] as VoteWithUser) : null;
  }

  async selectByStep(stepId: number): Promise<VoteWithUser[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT v.id, v.created_at, v.user_id, v.step_id, v.vote, v.comment, u.name as user_name
       FROM vote v
       JOIN user u ON v.user_id = u.id
       WHERE v.step_id = ?
       ORDER BY v.created_at DESC`,
      [stepId],
    );
    return rows as VoteWithUser[];
  }

}

export default new stepRepository();
