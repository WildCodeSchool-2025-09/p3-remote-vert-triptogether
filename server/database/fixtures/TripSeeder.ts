import AbstractSeeder from "./AbstractSeeder";

// Import seeders that must be executed before this one
// Follow your foreign keys to find the right order ;)
import UserSeeder from "./UserSeeder";

class TripSeeder extends AbstractSeeder {
  constructor() {
    // Call the constructor of the parent class (AbstractSeeder) with appropriate options
    super({ table: "trip", truncate: true, dependencies: [UserSeeder] });
  }

  // The run method - Populate the 'trip' table with fake data

  run() {
    // Generate and insert fake data into the 'trip' table
    for (let i = 0; i < 10; i += 1) {
      // Generate fake trip data
      const fakeTrip = {
        title: this.faker.lorem.word(), // Generate a fake title using faker library
        user_id: this.getRef(`user_${i}`).insertId, // Get the insertId of the corresponding user from UserSeeder
      };

      // Insert the fakeTrip data into the 'trip' table
      this.insert(fakeTrip); // insert into trip(title, user_id) values (?, ?)
    }
  }
}

// Export the TripSeeder class
export default TripSeeder;
