import AbstractSeeder from "./AbstractSeeder";
import StepSeeder from "./StepSeeder";
import UserSeeder from "./UserSeeder";

class VoteSeeder extends AbstractSeeder {
  constructor() {
    super({
      table: "vote",
      truncate: true,
      dependencies: [UserSeeder, StepSeeder],
    });
  }

  async run() {
    while (!this.getRef("user_0") || !this.getRef("step_0")) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    let userCount = 0;
    let stepCount = 0;

    while (this.getRef(`user_${userCount}`)) {
      userCount++;
    }

    while (this.getRef(`step_${stepCount}`)) {
      stepCount++;
    }

    for (let stepIndex = 0; stepIndex < stepCount; stepIndex++) {
      const stepId = this.getRef(`step_${stepIndex}`).insertId;

      const votantsCount = this.faker.number.int({
        min: 2,
        max: Math.min(userCount, 5), // Max 5 votants par étape
      });

      const userIndexes = this.getRandomUserIndexes(userCount, votantsCount);

      for (const userIndex of userIndexes) {
        const userId = this.getRef(`user_${userIndex}`).insertId;

        const createdDate = this.faker.date.between({
          from: "2026-01-01T00:00:00.000Z",
          to: new Date(),
        });

        const fakeVote = {
          created_at: createdDate.toISOString().split("T")[0],
          user_id: userId,
          step_id: stepId,
          vote: this.faker.datatype.boolean(),
          comment: this.faker.helpers.maybe(() => this.faker.lorem.sentence(), {
            probability: 0.6,
          }),
        };

        this.insert(fakeVote);
      }
    }
  }
  private getRandomUserIndexes(userCount: number, count: number): number[] {
    const allIndexes = Array.from({ length: userCount }, (_, i) => i);
    return this.faker.helpers.shuffle(allIndexes).slice(0, count);
  }
}

export default VoteSeeder;
