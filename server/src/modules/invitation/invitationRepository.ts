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
};

type InvitationWithTrip = Invitation & {
  trip_start: string | null;
};

type InvitationWithDetails = Invitation & {
  trip_start: string | null;
  trip_title: string;
  creator_firstname: string;
  creator_lastname: string;
  invited_firstname: string;
  invited_lastname: string;
};

class invitationRepository {
  async create(invitation: Omit<Invitation, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO invitation (status, created_at, updated_at, creator_id, invited_id, trip_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        invitation.status,
        invitation.created_at,
        invitation.updated_at,
        invitation.creator_id,
        invitation.invited_id,
        invitation.trip_id,
      ],
    );

    return Number(result.insertId);
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM invitation WHERE id = ?",
      [id],
    );

    return rows[0] as Invitation;
  }

  async readTrip(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT p.*, t.start_at AS trip_start FROM invitation p JOIN trip t ON p.trip_id = t.id WHERE p.id = ?",
      [id],
    );

    return rows[0] as InvitationWithTrip | null;
  }
  async readWithDetails(id: number): Promise<InvitationWithDetails | null> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        p.*, 
        t.title AS trip_title, t.start_at AS trip_start,
        c.firstname AS creator_firstname, c.lastname AS creator_lastname,
        i.firstname AS invited_firstname, i.lastname AS invited_lastname
      FROM invitation p
      JOIN trip t ON p.trip_id = t.id
      JOIN user c ON p.creator_id = c.id
      JOIN user i ON p.invited_id = i.id
      WHERE p.id = ?
    `,
      [id],
    );
    return rows[0] as InvitationWithDetails | null;
  }

  async readAllForUser(userId: number): Promise<InvitationWithDetails[]> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        p.*, 
        t.title AS trip_title, t.start_at AS trip_start,
        c.firstname AS creator_firstname, c.lastname AS creator_lastname,
        i.firstname AS invited_firstname, i.lastname AS invited_lastname
      FROM invitation p
      JOIN trip t ON p.trip_id = t.id
      JOIN user c ON p.creator_id = c.id
      JOIN user i ON p.invited_id = i.id
      WHERE p.creator_id = ? OR p.invited_id = ?
      ORDER BY p.created_at DESC
    `,
      [userId, userId],
    );
    return rows as InvitationWithDetails[];
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM invitation ORDER BY created_at DESC",
    );

    return rows as Invitation[];
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

  async delete(id: number): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM invitation WHERE id = ?",
      [id],
    );
    return result.affectedRows === 1;
  }
}

export default new invitationRepository();
