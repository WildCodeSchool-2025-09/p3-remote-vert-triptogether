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
  // The C of CRUD - Create operation

  async create(invitation: Omit<Invitation, "id">) {
    // Execute the SQL INSERT query to add a new Invitation to the "Invitation" table
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO participate (status, created_at, updated_at, creator_id, invited_id, trip_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        invitation.status,
        invitation.created_at,
        invitation.updated_at,
        invitation.creator_id,
        invitation.invited_id,
        invitation.trip_id,
      ],
    );

    // Return the ID of the newly inserted Invitation
    return Number(result.insertId);
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific Invitation by its ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM participate WHERE id = ?",
      [id],
    );

    // Return the first row of the result, which represents the Invitation
    return rows[0] as Invitation;
  }

  async readTrip(id: number) {
    // Execute the SQL SELECT query to retrieve a specific Invitation by its ID
    const [rows] = await databaseClient.query<Rows>(
      "SELECT p.*, t.start_at AS trip_start FROM participate p JOIN trip t ON p.trip_id = t.id WHERE p.id = ?",
      [id],
    );

    // Return the first row of the result, which represents the Invitation
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
      FROM participate p
      JOIN trip t ON p.trip_id = t.id
      JOIN user c ON p.creator_id = c.id
      JOIN user i ON p.invited_id = i.id
      WHERE p.id = ?
    `,
      [id],
    );
    return rows[0] as InvitationWithDetails | null;
  }

  // READ ALL pour un user (ses invites envoyées/reçues)
  async readAllForUser(userId: number): Promise<InvitationWithDetails[]> {
    const [rows] = await databaseClient.query<Rows>(
      `
      SELECT 
        p.*, 
        t.title AS trip_title, t.start_at AS trip_start,
        c.firstname AS creator_firstname, c.lastname AS creator_lastname,
        i.firstname AS invited_firstname, i.lastname AS invited_lastname
      FROM participate p
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
    // Execute the SQL SELECT query to retrieve all Invitations from the "Invitation" table
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM participate ORDER BY created_at DESC",
    );

    // Return the array of Invitations
    return rows as Invitation[];
  }

  // The U of CRUD - Update operation
  async update(
    id: number,
    updates: Partial<Omit<Invitation, "id">>,
  ): Promise<boolean> {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), id];

    const [result] = await databaseClient.query<Result>(
      `UPDATE participate SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
    );
    return result.affectedRows === 1;
  }

  // The D of CRUD - Delete operation
  async delete(id: number): Promise<boolean> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM participate WHERE id = ?",
      [id],
    );
    return result.affectedRows === 1;
  }
}

export default new invitationRepository();
