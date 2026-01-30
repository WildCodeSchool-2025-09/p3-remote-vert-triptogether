import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { VoteWithUser } from "../../types/voteType";
class VoteRepository {
  async stepExists(stepId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM step WHERE id = ?",
      [stepId],
    );
    return rows.length > 0;
  }

  async isUserMemberOfStepTrip(
    stepId: number,
    userId: number,
  ): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT i.id 
       FROM invitation AS i
       JOIN step AS s ON s.trip_id = i.trip_id
       WHERE s.id = ? AND (i.creator_id = ? OR i.invited_id = ?) AND i.status = "accepted"`,
      [stepId, userId, userId],
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

export default new VoteRepository();
