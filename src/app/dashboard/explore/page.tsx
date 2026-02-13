import { Box, Text } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetAvailableAssignments } from "@/app/actions/get-available-assignments";
import ExploreClient from "@/app/components/explore-client";
import { AssignmentCardSkeleton } from "@/app/components/assignment-card-skeleton";
import { Suspense } from "react";

async function ExploreContent() {
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
      <Text size="2" color="red">
        {error}
      </Text>
    );
  }

  return (
    <ExploreClient
      initialAssignments={initialAssignments}
      initialHasMore={hasMore}
    />
  );
}

export default function ExplorePage() {
  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">Explore</h1>
      </Box>
      <Suspense
        fallback={
          <>
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
            <AssignmentCardSkeleton />
          </>
        }
      >
        <ExploreContent />
      </Suspense>
    </div>
  );
}
