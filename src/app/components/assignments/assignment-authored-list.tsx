import React from "react";
import { Box, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssignmentCard } from "./assignment-card";
import type { Profile } from "@/types";

async function getProfileMapByIds(userIds: string[]) {
  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
  const map = new Map<string, Profile>();

  if (uniqueUserIds.length === 0) {
    return map;
  }

  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", uniqueUserIds);

  (data ?? []).forEach((profile) => {
    map.set(profile.id, profile as Profile);
  });

  return map;
}

export default async function AssignmentAuthoredList({
  search,
  limit,
}: {
  search?: string;
  limit?: number;
}) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let query = supabase
    .from("assignments")
    .select(
      `
      id,
      title,
      description,
      deadline,
      visibility,
      created_at,
      assignment_claims(status),
      assignment_allowed_users(user_id)
    `,
    )
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (typeof limit === "number" && limit > 0) {
    query = query.range(0, limit - 1);
  }

  const { data: authored, error: authoredError } = await query;
  const authoredCount = authored?.length ?? 0;

  const allowedUserIds = [
    ...new Set(
      (authored ?? [])
        .map((a: any) => a.assignment_allowed_users?.[0]?.user_id)
        .filter(Boolean),
    ),
  ];

  const profileMap = await getProfileMapByIds(allowedUserIds);

  return (
    <div>
      {authoredError ? (
        <Text size="2" color="red">
          {authoredError.message}
        </Text>
      ) : authoredCount === 0 ? (
        <Text size="2" color="gray">
          You haven't created any assignments yet.
        </Text>
      ) : (
        <Box>
          {(authored ?? []).map((a: any) => (
            <AssignmentCard
              key={a.id}
              assignment={{
                ...a,
                status: a.assignment_claims?.[0]?.status ?? "not_taken",
                assigned_profile: profileMap.get(
                  a.assignment_allowed_users?.[0]?.user_id,
                ),
              }}
              detailsHref={`/dashboard/assignments/${a.id}`}
            />
          ))}
        </Box>
      )}
    </div>
  );
}
