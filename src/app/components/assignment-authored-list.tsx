import React from "react";
import { Box, Text, Card } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    .select("id, title, description, deadline, visibility, created_at")
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
          {authored.map((a) => (
            <Card key={a.id} className="mb-3 p-3">
              <Box className="mb-2">
                <Text className="font-medium">{a.title}</Text>
              </Box>
              <Box className="mb-2">
                <Text size="2" color="gray">
                  {a.description}
                </Text>
              </Box>
              <Box className="flex gap-4">
                <Text size="2">
                  Deadline: {new Date(a.deadline).toLocaleDateString()}
                </Text>
              </Box>
              <Box>
                <Text size="2">Visibility: {a.visibility}</Text>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
}
