export interface invitationType {
  id: number;
  status: string;
  trip_id: number;
  creator_id: number;
  invited_id: number;
  trip_title?: string;
  creator_firstname?: string;
  creator_lastname?: string;
  invited_firstname?: string;
  invited_lastname?: string;
}
