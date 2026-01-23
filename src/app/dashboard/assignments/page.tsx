import { Box, Card, Tabs, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssignmentAuthoredList from "@/app/components/assignment-authored-list";

export default async function AssignmentPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
              <AssignmentAuthoredList />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </div>
  );
}
