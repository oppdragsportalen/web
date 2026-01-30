import { Box, Text, TextField } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssignmentCard } from "@/app/components/assignment-card";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default async function ExplorePage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get claimed assignment IDs
  const { data: claims } = await supabase
    .from("assignment_claims")
    .select("assignment_id")
    .eq("status", "accepted");

  const claimedIds = claims?.map((c) => c.assignment_id) || [];

  // Get public assignments
  const { data: availableAssignments, error } = await supabase
    .from("assignments")
    .select("id, title, description, deadline, visibility, created_at")
    .eq("visibility", "public")
    .neq("creator_id", user.id)
    .not("id", "in", `(${claimedIds.join(",")})`)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-4 min-w-80">
        <Box className="mt-4 mb-10">
          <h1 className="text-3xl font-bold">Explore</h1>
        </Box>
        <Text size="2" color="red">
          {error.message}
        </Text>
      </div>
    );
  }

  return (
    <div className="p-4 min-w-80">
      <Box className="mt-4 mb-10">
        <h1 className="text-3xl font-bold">Explore</h1>
      </Box>

      {!availableAssignments || availableAssignments.length === 0 ? (
        <Text size="2" color="gray">
          No available assignments yet. Check back later or create your own.
        </Text>
      ) : (
        <Box>
          {availableAssignments.map((a) => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              detailsHref={`/dashboard/explore/${a.id}`}
            />
          ))}
          <Text size="2" color="gray" className="mb-3 block">
            {availableAssignments.length} assignment
            {availableAssignments.length === 1 ? "" : "s"} available
          </Text>
        </Box>
      )}
    </div>
  );
}
