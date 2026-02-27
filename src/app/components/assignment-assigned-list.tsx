import { Box, Text, Link, Button } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { AssignmentCard } from "./assignment-card";
import { redirect } from "next/navigation";

export default async function AssignmentAssignedList() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get assigned assignments
  const { data: assignments, error } = await supabase
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

  if (error) {
    return (
      <Text size="2" color="red">
        {error.message}
      </Text>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Box>
        <Text size="2" color="gray">
          You haven't taken any assignments yet. Explore and take assignments to
          get started.
        </Text>
        <Box>
          <Link href="/dashboard/explore" underline="none">
            <Button mt="2" size="2" variant="solid">
              Explore assignments
            </Button>
          </Link>
        </Box>
      </Box>
    );
  }

  const creatorIds = [
    ...new Set((assignments ?? []).map((a: any) => a.assignments?.creator_id).filter(Boolean)),
  ];

  const creatorEmailMap = new Map<string, string>();

  if (creatorIds.length > 0) {
    const { data: emailsList } = await supabase.rpc(
      "get_user_emails_by_ids",
      {
        user_ids: creatorIds,
      },
    );

    if (emailsList) {
      (emailsList as Array<{ id: string; email: string }>).forEach((row) => {
        creatorEmailMap.set(row.id, row.email);
      });
    }
  }

  return (
    <Box>
      {assignments
        .map((claim: any) => ({
          ...claim.assignments,
          status: claim.status,
          creator_email: creatorEmailMap.get(claim.assignments?.creator_id),
        }))
        .filter((a: any) => a.id)
        .map((a: any) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            detailsHref={`/dashboard/assignments/${a.id}`}
          />
        ))}
      <Text size="2" color="gray" className="mb-3 block">
        {assignments.length} assignment
        {assignments.length === 1 ? "" : "s"}
      </Text>
    </Box>
  );
}
