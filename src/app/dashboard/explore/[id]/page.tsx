import { Card, Box, Text, Flex, Badge, Separator } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AssignmentActionButton } from "@/app/components/assignment-action-button";

async function getAssignment(id: string, userId: string) {
  const supabase = await createSupabaseServer();

  const { data: assignment, error } = await supabase
    .from("assignments")
    .select("id, title, description, deadline, visibility, created_at")
    .eq("id", id)
    .single();

  if (error || !assignment) {
    return { assignment: null, error };
  }

  if (assignment.visibility === "restricted") {
    const { data: allowed } = await supabase
      .from("assignment_allowed_users")
      .select("user_id")
      .eq("assignment_id", id)
      .eq("user_id", userId)
      .single();

    if (!allowed) {
      return { assignment: null, error: { message: "Access denied" } };
    }
  }

  // Get claim status
  const { data: claim } = await supabase
    .from("assignment_claims")
    .select("status")
    .eq("assignment_id", id)
    .eq("user_id", userId)
    .single();

  return {
    assignment: { ...assignment, claimStatus: claim?.status },
    error: null,
  };
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "accepted":
      return <Badge color="blue">Taken</Badge>;
    case "in_progress":
      return <Badge color="amber">In Progress</Badge>;
    case "finished":
      return <Badge color="green">Finished</Badge>;
    default:
      return <Badge color="gray">Not Taken</Badge>;
  }
}

function getVisibilityBadge(visibility?: string) {
  switch (visibility) {
    case "public":
      return <Badge color="cyan">Public</Badge>;
    default:
      return (
        <Badge color="gray" variant="outline">
          Restricted
        </Badge>
      );
  }
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { assignment, error } = await getAssignment(id, user.id);

  if (error || !assignment) {
    redirect("/dashboard/explore");
  }

  return (
    <div className="p-4 min-w-xl">
      <Box className="mt-4 mb-10">
        <Flex align="center" gap="2" className="mb-6">
          <Link href="/dashboard/explore">
            <h1 className="text-3xl font-bold text-(--gray-9) hover:underline hover:text-(--color-text)">
              Explore
            </h1>
          </Link>
          <Text size="4" color="gray">
            /
          </Text>
          <h1 className="text-3xl font-bold text-nowrap">{assignment.title}</h1>
        </Flex>
      </Box>

      <Card>
        <Flex justify="between" align="start" gap="4" mb="5">
          <Box>
            <Text size="5" weight="bold" className="leading-tight">
              {assignment.title}
            </Text>
          </Box>

          <Flex gap="2" wrap="wrap" align="center">
            {getVisibilityBadge(assignment.visibility)}
            {getStatusBadge((assignment as any).claimStatus)}
          </Flex>
        </Flex>

        {assignment.description && (
          <Box mb="5">
            <Box>
              <Text size="2" weight="medium" color="gray">
                Description
              </Text>
            </Box>
            <Card>
              <Text size="2">{assignment.description}</Text>
            </Card>
          </Box>
        )}

        <Box mb="5">
          <Flex gap="4">
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Deadline
                </Text>
              </Box>
              <Card>
                <Text size="2">
                  {new Date(assignment.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Status
                </Text>
              </Box>
              <Card className="w-full">
                <Text size="2" className="capitalize">
                  {(() => {
                    const status = (assignment as any).claimStatus;
                    if (status === "accepted") return "Taken";
                    if (status === "in_progress") return "In Progress";
                    if (status === "finished") return "Finished";
                    return "Not Taken";
                  })()}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Assignment Type
                </Text>
              </Box>
              <Card className="w-full">
                <Text size="2" className="capitalize">
                  {assignment.visibility}
                </Text>
              </Card>
            </Box>
          </Flex>
        </Box>

        <Separator size="4" />

        <Flex justify="end" align="center" gap="3" mt="4">
          <AssignmentActionButton
            assignmentId={assignment.id}
            isTaken={(assignment as any).claimStatus === "accepted"}
          />
        </Flex>
      </Card>
    </div>
  );
}
