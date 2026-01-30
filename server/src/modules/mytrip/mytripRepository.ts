import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";
import type { Trip } from "../../types/tripType";

class MytripRepository {
  async selectByUserId(userId: number, status: string) {
    let dateCondition = "";

    if (status === "futur") {
      dateCondition = "AND start_at > NOW()";
    } else if (status === "current") {
      dateCondition = "AND start_at <= NOW() AND end_at >= NOW()";
    } else if (status === "past") {
      dateCondition = "AND end_at < NOW()";
    }

    const [rows] = await databaseClient.query<Rows>(
      `SELECT * FROM trip WHERE user_id = ? ${dateCondition} ORDER BY start_at ASC`,
      [userId],
    );
    return rows as Trip[];
  }
}

export default new MytripRepository();