import AbstractSeeder from "./AbstractSeeder";
import TripSeeder from "./TripSeeder";

class DestinationSeeder extends AbstractSeeder {
  constructor() {
    super({ table: "destination", truncate: true, dependencies: [TripSeeder] });
  }

  async run() {
    for (let i = 0; i < 10; i += 1) {
      const fakeDestination = {
        city: this.faker.location.city(),
        country: this.faker.location.country(),
        trip_id: this.getRef(`trip_${i}`).insertId,
        refName: `destination_${i}`,
      };

      this.insert(fakeDestination);
    }
  }
}

export default DestinationSeeder;
