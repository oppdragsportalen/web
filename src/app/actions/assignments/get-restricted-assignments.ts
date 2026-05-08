"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

async function getProfileMapByIds(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
  const map = new Map();

  if (uniqueUserIds.length === 0) {
    return map;
  }

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", uniqueUserIds);

  (data ?? []).forEach((profile) => {
    map.set(profile.id, profile);
  });

  return map;
}

const ITEMS_PER_LOAD = 12;

export async function GetRestrictedAssignments(
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
  const { data: claimedAssignments } = await supabase
    .from("assignment_claims")
    .select("assignment_id")
    .eq("user_id", user.id);

  const claimedIds = claimedAssignments?.map((c) => c.assignment_id) || [];

  const rangeStart = batchIndex * ITEMS_PER_LOAD;
  const rangeEnd = rangeStart + ITEMS_PER_LOAD - 1;

  const normalizedQuery = searchQuery.trim();

  let assignmentsQuery = supabase
    .from("assignments")
    .select(
      "id, title, description, deadline, creator_id, visibility, created_at, assignment_allowed_users!inner(user_id)",
      { count: "exact" },
    )
    .eq("visibility", "restricted")
    .eq("assignment_allowed_users.user_id", user.id);

  if (claimedIds.length > 0) {
    assignmentsQuery = assignmentsQuery.not(
      "id",
      "in",
      `(${claimedIds.join(",")})`,
    );
  }

  if (normalizedQuery) {
    assignmentsQuery = assignmentsQuery.or(
      `title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`,
    );
  }

  let {
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

  const creatorIds = [
    ...new Set((assignments ?? []).map((a) => a.creator_id).filter(Boolean)),
  ];
  const profileMap = await getProfileMapByIds(creatorIds);

  // Add creator profile to assignments
  assignments = (assignments ?? []).map((assignment) => ({
    ...assignment,
    creator_profile: profileMap.get(assignment.creator_id),
  }));

  return { assignments, hasMore, error: null };
}
