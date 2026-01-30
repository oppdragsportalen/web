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
      "id, title, description, deadline, visibility, created_at, assignment_claims(status)",
    )
    .eq("creator_id", user.id);

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
          {authored.map((a: any) => (
            <AssignmentCard
              key={a.id}
              assignment={{
                ...a,
                status: a.assignment_claims?.[0]?.status ?? "not_taken",
              }}
              detailsHref={`/dashboard/assignments/${a.id}`}
            />
          ))}
        </Box>
      )}
    </div>
  );
}
