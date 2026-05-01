import type { Profile } from "./profile";

export type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  visibility: "public" | "restricted";
  created_at: string;
  creator_id: string;
  claimStatus?: string;
  assigned_profile?: Profile;
  creator_profile: Profile;
};
