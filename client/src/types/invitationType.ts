export interface invitationType {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  trip_id: number;
  user_id: number;
  trip_title?: string;
  trip_start: string;
  creator_firstname?: string;
  creator_lastname?: string;
  invited_firstname?: string;
  invited_lastname?: string;
  lastReminderAt?: string | null;
}

export type Guest = {
  id: number;
  name: string;
  avatarUrl?: string | null;
  addedAt: string;
  role?: "organisateur" | "membre" | "non confirmé";
  inviteState?: "refuse" | "en-attente";
  lastReminderAt?: string | null;
};
