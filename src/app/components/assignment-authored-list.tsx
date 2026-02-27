import React from "react";
import { Box, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssignmentCard } from "./assignment-card";

export default async function AssignmentAuthoredList() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: authored, error: authoredError } = await supabase
    .from("assignments")
    .select(
      "id, title, description, deadline, visibility, created_at, assignment_claims(status), assignment_allowed_users(user_id)",
    )
    .eq("creator_id", user.id);

  const allowedUserIds = [
    ...new Set(
      (authored ?? [])
        .map((a: any) => a.assignment_allowed_users?.user_id)
        .filter(Boolean),
    ),
  ];

  const allowedUserEmailMap = new Map<string, string>();

  if (allowedUserIds.length > 0) {
    const { data: emailsList, error: emailError } = await supabase.rpc(
      "get_user_emails_by_ids",
      {
        user_ids: allowedUserIds,
      },
    );

    if (emailsList) {
      (emailsList as Array<{ id: string; email: string }>).forEach((row) => {
        allowedUserEmailMap.set(row.id, row.email);
      });
    }
  }

  return (
    <div>
      {authoredError ? (
        <Text size="2" color="red">
          {authoredError.message}
        </Text>
      ) : !authored || authored.length === 0 ? (
        <Text size="2">You haven't created any assignments yet.</Text>
      ) : (
        <Box>
          {(authored ?? []).map((a: any) => (
            <AssignmentCard
              key={a.id}
              assignment={{
                ...a,
                status: a.assignment_claims?.[0]?.status ?? "not_taken",
                assigned_email: allowedUserEmailMap.get(
                  a.assignment_allowed_users?.user_id,
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
