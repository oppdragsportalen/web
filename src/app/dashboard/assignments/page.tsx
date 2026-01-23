import { Box, Card, Tabs, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AssignmentPage() {
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
    .eq("creator_id", user.id)

  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <Text className="text-3xl font-bold">Assignments</Text>
      </Box>
      <Box>
        <Tabs.Root defaultValue="authored">
          <Tabs.List
            className="sticky top-0 z-10"
            style={{ backgroundColor: "var(--color-background)" }}
          >
            <Tabs.Trigger value="assigned">Assigned</Tabs.Trigger>
            <Tabs.Trigger value="authored">Authored</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="assigned">
              <Text size="2">Assignments assigned to you.</Text>
            </Tabs.Content>

            <Tabs.Content value="authored">
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
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </div>
  );
}
