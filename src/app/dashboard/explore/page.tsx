import { Box, Text, Tabs } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GetAvailableAssignments } from "@/app/actions/assignments/get-available-assignments";
import { GetRestrictedAssignments } from "@/app/actions/assignments/get-restricted-assignments";
import ExploreClient from "@/app/components/assignments/explore-client";
import { AssignmentCardSkeleton } from "@/app/components/assignments/assignment-card-skeleton";
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

async function RestrictedContent() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    assignments: initialAssignments,
    hasMore,
    error,
  } = await GetRestrictedAssignments(0);

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
      fetchAction={GetRestrictedAssignments}
    />
  );
}

export default function ExplorePage() {
  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <h1 className="text-3xl font-bold max-sm:text-xl">Explore</h1>
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
        <Tabs.Root defaultValue="public">
          <Tabs.List>
            <Tabs.Trigger value="public">Public</Tabs.Trigger>
            <Tabs.Trigger value="restricted">Assigned to you</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="public">
            <ExploreContent />
          </Tabs.Content>

          <Tabs.Content value="restricted">
            <Suspense
              fallback={
                <>
                  <AssignmentCardSkeleton />
                  <AssignmentCardSkeleton />
                  <AssignmentCardSkeleton />
                </>
              }
            >
              <RestrictedContent />
            </Suspense>
          </Tabs.Content>
        </Tabs.Root>
      </Suspense>
    </div>
  );
}
