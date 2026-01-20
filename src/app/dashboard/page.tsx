import { Box, Card, Text, Button } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TimeBasedGreeting from "@/app/components/time-based-greeting";
import { CreateAssignmentDialog } from "@/app/components/create-assignment-dialog";
import { PlusIcon } from "@radix-ui/react-icons";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <TimeBasedGreeting displayName={profile.display_name} />
      </Box>
      <Box>
        <Card size="2" className="max-w-xl">
          <Box mb="6">
            <Text size="4" className="font-bold">
              Create a new assignment
            </Text>
          </Box>
          <CreateAssignmentDialog
            trigger={<Button variant="solid"> <PlusIcon /> Create Assignment</Button>}
          />
        </Card>
      </Box>
    </div>
  );
}
