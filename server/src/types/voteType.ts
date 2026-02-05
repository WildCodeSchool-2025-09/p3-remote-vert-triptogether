export type Vote = {
  id: number;
  created_at: string;
  user_id: number;
  step_id: number;
  vote: boolean;
  comment: string | null;
};

export type VoteWithUser = Vote & {
  user_name: string;
};

export type NewVote = {
  user_id: number;
  step_id: number;
  vote: boolean;
  comment: string | null;
};

export type VotesStats = {
  step_id: number;
  allVotes: VoteWithUser[];
  voteStats: {
    yes: number;
    no: number;
  };
};

