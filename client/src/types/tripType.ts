export type Step = {
  id: number;
  city: string;
  country: string;
  trip_id: number;
  status?: "pending" | "validated" | "rejected";
  voteStats?: {
    yes: number;
    no: number;
    total: number;
  };
};

export type StepCardProps = {
  step: Step;
  currentUserId: number;
  tripId: number;
  memberCount?: number;
};

export type StepsResponse =
  | {
      trip: {
        id: number;
        title: string;
        description: string;
        memberCount: number;
      };
      steps: Step[];
    }
  | { error?: string; message?: string };
