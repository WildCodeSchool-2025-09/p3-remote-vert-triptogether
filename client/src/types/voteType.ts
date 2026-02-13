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
  summary: {
    yes: number;
    no: number;
    total: number;
  };
};

export type CreateVotePayload = {
  vote: boolean;
  comment?: string;
  user_id: number;
};
import type { TheTrip } from "./tripType";

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
  trip?: TheTrip | null;
};
