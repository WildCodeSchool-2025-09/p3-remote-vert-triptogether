import AbstractSeeder from "./AbstractSeeder";
import TripSeeder from "./TripSeeder";

class StepSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "step", truncate: true, dependencies: [TripSeeder] });
  }

  async run() {
    let tripCount = 0;
    while (this.getRef(`trip_${tripCount}`)) {
      tripCount++;
    }

    let stepIndex = 0;

    for (let tripIndex = 0; tripIndex < tripCount; tripIndex++) {
      const tripId = this.getRef(`trip_${tripIndex}`).insertId;

      const stepsPerTrip = this.faker.number.int({ min: 3, max: 7 });

      for (let i = 0; i < stepsPerTrip; i++) {
        const fakeStep = {
          city: this.faker.location.city(),
          country: this.faker.location.country(),
          trip_id: tripId,
          refName: `step_${stepIndex}`,
        };

        this.insert(fakeStep);
        stepIndex++;
      }
    }
  }
}

export default StepSeeder;
