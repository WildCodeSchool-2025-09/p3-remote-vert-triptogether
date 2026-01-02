import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Trip = {
  id: number;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  user_id: number;
};

class TripRepository {
  // The C of CRUD - Create operation

  async create(trip: Omit<Trip, "id">) {
    // Execute the SQL INSERT query to add a new trip to the "trip" table
    const [result] = await databaseClient.query<Result>(
      "insert into trip (title, description, start_at, end_at, user_id) values (?, ?, ?, ?, ?)",
      [trip.title, trip.description, trip.start_at, trip.end_at, trip.user_id],
    );

    // Return the ID of the newly inserted trip
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific trip by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from trip where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the trip
    return rows[0] as Trip;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all Trips from the "trip" table
    const [rows] = await databaseClient.query<Rows>("select * from trip");

    // Return the array of trips
    return rows as Trip[];
  }

  // The U of CRUD - Update operation
  // TODO: Implement the update operation to modify an existing trip

  // async update(trip: Trip) {
  //   ...
  // }

  // The D of CRUD - Delete operation
  // TODO: Implement the delete operation to remove an trip by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new TripRepository();
