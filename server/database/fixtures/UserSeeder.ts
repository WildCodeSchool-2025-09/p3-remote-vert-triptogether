import AbstractSeeder from "./AbstractSeeder";

class UserSeeder extends AbstractSeeder {
  constructor() {
    // Call the constructor of the parent class (AbstractSeeder) with appropriate options
    super({ table: "user", truncate: true });
  }

  // The run method - Populate the 'user' table with fake data

  run() {
    // Generate and insert fake data into the 'user' table

    for (let i = 0; i < 10; i += 1) {
      const fakeUser = {
        firstname: this.faker.person.firstName(),
        lastname: this.faker.person.lastName(),
        email: this.faker.internet.email(),
        // pour rester dans VARCHAR(50) on limite la longueur
        password: this.faker.internet.password({ length: 20 }),
        refName: `user_${i}`,
      };

      this.insert(fakeUser);
    }
  }
}

// Export the UserSeeder class
export default UserSeeder;
