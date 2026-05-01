import type { Profile } from "./profile";
import type { ClaimStatus } from "./index";

export type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  visibility: "public" | "restricted";
  created_at: string;
  creator_id: string;
  claimStatus?: ClaimStatus;
  assigned_profile?: Profile;
  creator_profile?: Profile;
  claimed_by_profile?: Profile;
  assignedUsername?: string;
};
