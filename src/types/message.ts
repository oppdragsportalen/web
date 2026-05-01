import type { Profile } from "./profile";

export type Message = {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
  sender: Profile;
};
