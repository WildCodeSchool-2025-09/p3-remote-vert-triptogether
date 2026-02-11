export type Trip = {
  id: number;
  title: string;
  description: string;
  city: string;
  country: string;
  start_at: string;
  end_at: string;
  image_url?: string;
  user_id?: number;
  participants?: number;
  status?: "pending" | "accepted" | "refused";
  role?: "organizer" | "participant";
};
