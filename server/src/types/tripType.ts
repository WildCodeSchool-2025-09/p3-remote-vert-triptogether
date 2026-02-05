export type Trip = {
  id?: number;
  title: string;
  description: string;
  city: string;
  country: "France";
  start_at: string;
  end_at: string;
  user_id: number;
  owner_firstname?: string;
  owner_lastname?: string;
};
