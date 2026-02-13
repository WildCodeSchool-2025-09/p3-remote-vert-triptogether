import type { Trip } from "./tripType";

export type Vote = {
  id: number;
  created_at: string;
  user_id: number;
  step_id: number;
  vote: boolean;
  comment: string | null;
  user_name: string;
};

export type VotesStats = {
  step_id: number;
  allVotes: Vote[];
  voteStats: {
    yes: number;
    no: number;
  };
};

export type CreateVotePayload = {
  vote: boolean;
  comment?: string;
};

export type Step = {
  id: number;
  city: string;
  country: string;
  trip_id: number;
  image_url?: string;
};

export type StepCardProps = {
  step: Step;
  currentUserId: number;
  tripId: number;
  isMainDestination?: boolean;
  trip?: Trip | null;
};
