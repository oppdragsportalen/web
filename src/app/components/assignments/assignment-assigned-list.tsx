import { Box, Text, Link, Button } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { AssignmentCard } from "./assignment-card";
import { redirect } from "next/navigation";

type Profile = {
  id: string;
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

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

export default async function AssignmentAssignedList({
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

  // Get assigned assignments
  let query = supabase
    .from("assignment_claims")
    .select(
      `
      assignment_id,
      status,
      assignments:assignment_id (
        id,
        title,
        description,
        deadline,
        visibility,
        created_at,
        creator_id
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("assignments.title", `%${search}%`);
  }

  if (typeof limit === "number" && limit > 0) {
    query = query.range(0, limit - 1);
  }

  const { data: assignments, error } = await query;
  const assignmentCount = assignments?.length ?? 0;

  if (error) {
    return (
      <Text size="2" color="red">
        {error.message}
      </Text>
    );
  }

  if (assignmentCount === 0) {
    return (
      <Box>
        <Text size="2" color="gray">
          You haven't taken any assignments yet. Explore and take assignments to
          get started.
        </Text>
        {/* <Box>
          <Link href="/dashboard/explore" underline="none">
            <Button mt="2" size="2" variant="solid">
              Explore assignments
            </Button>
          </Link>
        </Box> */}
      </Box>
    );
  }

  const creatorIds = [
    ...new Set(
      (assignments ?? [])
        .map((a: any) => a.assignments?.creator_id)
        .filter(Boolean),
    ),
  ];

  const profileMap = await getProfileMapByIds(creatorIds);

  return (
    <Box>
      {assignments
        .map((claim: any) => ({
          ...claim.assignments,
          status: claim.status,
          creator_profile: profileMap.get(claim.assignments?.creator_id),
        }))
        .filter((a: any) => a.id)
        .map((a: any) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            detailsHref={`/dashboard/assignments/${a.id}`}
          />
        ))}
      {typeof limit !== "number" && (
        <Text size="2" color="gray" className="mb-3 block">
          {assignments.length} assignment
          {assignments.length === 1 ? "" : "s"}
        </Text>
      )}
    </Box>
  );
}
