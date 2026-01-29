import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Invitation = {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  creator_id: number;
  invited_id: number;
  trip_id: number;
  start_at?: string | null;
  trip_title?: string;
  creator_firstname?: string;
  creator_lastname?: string;
  invited_firstname?: string;
  invited_lastname?: string;
};

class invitationRepository {
  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT i.*, t.start_at AS start_at FROM invitation i JOIN trip t ON i.trip_id = t.id WHERE i.id = ?",
      [id],
    );

    return rows[0] as Invitation;
  }

  async select(id: number): Promise<Invitation | null> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        i.*, 
        t.title AS trip_title, t.start_at AS trip_start,
        c.firstname AS creator_firstname, c.lastname AS creator_lastname,
        u.firstname AS invited_firstname, u.lastname AS invited_lastname
      FROM invitation i
      JOIN trip t ON i.trip_id = t.id
      JOIN user c ON i.creator_id = c.id
      JOIN user u ON i.user_id = u.id
      WHERE i.id = ?
    `,
      [id],
    );
    return rows[0] as Invitation | null;
  }

  async updateStatus(
    id: number,
    status: "accepted" | "refused",
  ): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      "UPDATE invitation SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id],
    );
    return result.affectedRows === 1;
  }

  async findByTripId(tripId: number): Promise<Invitation[]> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        i.*, 
        t.title AS trip_title, t.start_at AS trip_start,
        c.firstname AS creator_firstname, c.lastname AS creator_lastname,
        u.firstname AS invited_firstname, u.lastname AS invited_lastname
      FROM invitation i
      JOIN trip t ON i.trip_id = t.id
      JOIN user c ON i.creator_id = c.id
      JOIN user u ON i.user_id = u.id
      WHERE i.trip_id = ?
      ORDER BY i.created_at ASC
    `,
      [tripId],
    );

    return rows as Invitation[];
  }

  async removeMemberFromTrip(tripId: number, userId: number): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      `
      UPDATE invitation
      SET status = 'removed', updated_at = CURRENT_TIMESTAMP
      WHERE trip_id = ? AND user_id = ? AND status = 'accepted'
      `,
      [tripId, userId],
    );

    return result.affectedRows === 1;
  }
}

export default new invitationRepository();
