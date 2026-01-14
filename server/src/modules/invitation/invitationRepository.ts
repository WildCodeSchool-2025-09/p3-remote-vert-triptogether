import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Invitation = {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  trip_id: number;
  trip_start: string;
};

class invitationRepository {
  // The C of CRUD - Create operation

  async create(invitation: Omit<Invitation, "id">) {
    // Execute the SQL INSERT query to add a new Invitation to the "Invitation" table
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO participate (title, description, start_at, end_at, user_id) VALUES (?, ?, ?, ?, ?)",
      [
        invitation.status,
        invitation.created_at,
        invitation.updated_at,
        invitation.user_id,
        invitation.trip_id,
      ],
    );

    // Return the ID of the newly inserted Invitation
    return result.insertId;
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
    return rows[0] as Invitation;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all Invitations from the "Invitation" table
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM participate",
    );

    // Return the array of Invitations
    return rows as Invitation[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing Invitation

  // async update(Invitation: Invitation) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an Invitation by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new invitationRepository();
