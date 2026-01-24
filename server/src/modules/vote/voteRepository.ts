import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Vote = {
  id: number;
  created_at: string;
  user_id: number;
  destination_id: number;
  vote: boolean;
  comment: string | null;
};

type VoteWithUser = Vote & {
  user_name: string;
};

class VoteRepository {
  async hasUserVoted(userId: number, destinationId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM vote WHERE user_id = ? AND destination_id = ?",
      [userId, destinationId],
    );
    return rows.length > 0;
  }

  async create(
    userId: number,
    destinationId: number,
    vote: boolean,
    comment: string | null,
  ): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO vote (user_id, destination_id, vote, comment) 
        VALUES (?, ?, ?, ?)`,
      [userId, destinationId, vote, comment],
    );
    return result.insertId;
  }

  async findByIdWithUser(voteId: number): Promise<VoteWithUser | null> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT v.*, u.name as user_name
        FROM vote AS v
        JOIN user AS u ON v.user_id = u.id
        WHERE v.id = ?`,
      [voteId],
    );
    return rows.length > 0 ? (rows[0] as VoteWithUser) : null;
  }

  async findByDestination(destinationId: number): Promise<VoteWithUser[]> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT v.id, v.created_at, v.user_id, v.destination_id, v.vote, v.comment, u.name as user_name
       FROM vote v
       JOIN user u ON v.user_id = u.id
       WHERE v.destination_id = ?
       ORDER BY v.created_at DESC`,
      [destinationId],
    );
    return rows as VoteWithUser[];
  }

  async destinationExists(destinationId: number): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM destination WHERE id = ?",
      [destinationId],
    );
    return rows.length > 0;
  }

  async isUserMemberOfDestinationTrip(
    userId: number,
    destinationId: number,
  ): Promise<boolean> {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT id 
       FROM participate AS p
       JOIN destination AS d ON d.trip_id = p.trip_id
       WHERE d.id = ? AND p.user_id = ? AND p.status = 'accepted'`,
      [destinationId, userId],
    );
    return rows.length > 0;
  }
}

export default new VoteRepository();
