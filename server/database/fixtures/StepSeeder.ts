import AbstractSeeder from "./AbstractSeeder";
import TripSeeder from "./TripSeeder";

class StepSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "step", truncate: true, dependencies: [TripSeeder] });
  }

  async run() {
    for (let i = 0; i < 10; i += 1) {
      const fakeStep = {
        city: this.faker.location.city(),
        country: this.faker.location.country(),
        trip_id: this.getRef(`trip_${i}`).insertId,
        refName: `step_${i}`,
      };

      this.insert(fakeStep);
    }
  }
}

export default StepSeeder;
