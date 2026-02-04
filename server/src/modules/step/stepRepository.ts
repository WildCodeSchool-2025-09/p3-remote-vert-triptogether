import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Step } from "../../types/tripType";
import type { VoteWithUser } from "../../types/voteType";

class stepRepository {
  async selectByTrip(tripId: number): Promise<Step[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT id, city, country, trip_id
       FROM step
       WHERE trip_id = ?
       ORDER BY id ASC`,
      [tripId],
    );
    return rows as Step[];
  }

  async getStepWithTrip(stepId: number): Promise<{
    id: number;
    trip_id: number;
    city: string;
    country: string;
  } | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, trip_id, city, country FROM step WHERE id = ?",
      [stepId],
    );
    return rows.length > 0
      ? (rows[0] as {
          id: number;
          trip_id: number;
          city: string;
          country: string;
        })
      : null;
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
    vote: 0 | 1,
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
      `SELECT v.*, u.firstname as user_name
       FROM vote AS v
       JOIN user AS u ON v.user_id = u.id
       WHERE v.id = ?`,
      [voteId],
    );
    return rows.length > 0 ? (rows[0] as VoteWithUser) : null;
  }

  async selectByStep(stepId: number): Promise<VoteWithUser[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT v.id, v.created_at, v.user_id, v.step_id, v.vote, v.comment, u.firstname as user_name
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
