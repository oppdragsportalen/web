import { Box, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetAvailableAssignments } from "@/app/actions/get-available-assignments";
import ExploreClient from "@/app/components/explore-client";

export default async function ExplorePage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get initial assignments
  const {
    assignments: initialAssignments,
    hasMore,
    error,
  } = await GetAvailableAssignments(0);

  if (error) {
    return (
      <div className="p-4 min-w-80">
        <Box className="mt-4 mb-10">
          <h1 className="text-3xl font-bold">Explore</h1>
        </Box>
        <Text size="2" color="red">
          {error}
        </Text>
      </div>
    );
  }

  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">Explore</h1>
      </Box>
      <ExploreClient
        initialAssignments={initialAssignments}
        initialHasMore={hasMore}
      />
    </div>
  );
}
