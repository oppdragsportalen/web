import { Card, Box, Text, Flex, Badge, Separator } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AssignmentActionButton } from "@/app/components/assignment-action-button";
import { formatDateToLocal } from "@/lib/timezone";

async function getAssignment(id: string, userId: string) {
  const supabase = await createSupabaseServer();

  const { data: assignment, error } = await supabase
    .from("assignments")
    .select(
      "id, title, description, deadline, visibility, created_at, creator_id",
    )
    .eq("id", id)
    .single();

  if (error || !assignment) {
    return { assignment: null, error };
  }

  let assignedEmail: string | null = null;
  let creatorEmail: string | null = null;

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

    // Get assigned user email for restricted assignments
    if (allowed?.user_id) {
      const { data: email } = await supabase.rpc("get_user_email_by_id", {
        user_id: allowed.user_id,
      });
      assignedEmail = email;
    }
  }

  // Get creator email
  if (assignment.creator_id) {
    const { data: email } = await supabase.rpc("get_user_email_by_id", {
      user_id: assignment.creator_id,
    });
    creatorEmail = email;
  }

  // Get claim status
  const { data: claim } = await supabase
    .from("assignment_claims")
    .select("status")
    .eq("assignment_id", id)
    .eq("user_id", userId)
    .single();

  return {
    assignment: {
      ...assignment,
      claimStatus: claim?.status,
      ...(assignedEmail && { assignedEmail }),
      ...(creatorEmail && { creator_email: creatorEmail }),
    },
    error: null,
  };
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "accepted":
      return <Badge color="blue">Accepted</Badge>;
    case "in_progress":
      return <Badge color="amber">In Progress</Badge>;
    case "finished":
      return <Badge color="green">Completed</Badge>;
    default:
      return <Badge color="gray">Available</Badge>;
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
          <div className="flex flex-wrap gap-4">
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Deadline
                </Text>
              </Box>
              <Card>
                <Text size="2" className="whitespace-nowrap">
                  {formatDateToLocal(assignment.deadline)}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Status
                </Text>
              </Box>
              <Card>
                <Text size="2" className="capitalize whitespace-nowrap">
                  {(() => {
                    const status = (assignment as any).claimStatus;
                    if (status === "accepted") return "Accepted";
                    if (status === "in_progress") return "In Progress";
                    if (status === "finished") return "Completed";
                    return "Available";
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
              <Card>
                <Text size="2" className="capitalize whitespace-nowrap">
                  {assignment.visibility}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Created By
                </Text>
              </Box>
              <Card>
                <Text size="2" className="whitespace-nowrap">
                  {(assignment as any).creator_email}
                </Text>
              </Card>
            </Box>
            {assignment.visibility === "restricted" &&
              (assignment as any).assignedEmail && (
                <Box>
                  <Box>
                    <Text size="2" weight="medium" color="gray">
                      Assigned To
                    </Text>
                  </Box>
                  <Card>
                    <Text size="2" className="whitespace-nowrap">
                      {(assignment as any).assignedEmail}
                    </Text>
                  </Card>
                </Box>
              )}
          </div>
        </Box>

        <Separator size="4" />

        <Flex justify="between" align="center" gap="3" wrap="wrap" mt="2">
          <Text size="2" color="gray">
            Created{" "}
            {new Date(assignment.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
          <AssignmentActionButton
            assignmentId={assignment.id}
            isTaken={!!(assignment as any).claimStatus}
            status={(assignment as any).claimStatus}
          />
        </Flex>
      </Card>
    </div>
  );
}
