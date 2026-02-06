"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

const ITEMS_PER_LOAD = 12;

export async function GetAvailableAssignments(
  batchIndex: number = 0,
  searchQuery: string = "",
) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignments: [], hasMore: false, error: "Not authenticated" };
  }

  // Get claimed assignment IDs
  const { data: claims } = await supabase
    .from("assignment_claims")
    .select("assignment_id")
    .eq("status", "accepted");

  const claimedIds = claims?.map((c) => c.assignment_id) || [];

  const rangeStart = batchIndex * ITEMS_PER_LOAD;
  const rangeEnd = rangeStart + ITEMS_PER_LOAD - 1;

  const normalizedQuery = searchQuery.trim();

  let assignmentsQuery = supabase
    .from("assignments")
    .select("id, title, description, deadline, visibility, created_at", {
      count: "exact",
    })
    .eq("visibility", "public")
    .neq("creator_id", user.id)
    .not("id", "in", claimedIds.length ? `(${claimedIds.join(",")})` : "0");

  if (normalizedQuery) {
    assignmentsQuery = assignmentsQuery.or(
      `title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`,
    );
  }

  const {
    data: assignments,
    error,
    count,
  } = await assignmentsQuery
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeEnd);

  if (error) {
    return { assignments: [], hasMore: false, error: error.message };
  }

  const hasMore = count ? (batchIndex + 1) * ITEMS_PER_LOAD < count : false;

  return { assignments: assignments ?? [], hasMore, error: null };
}
