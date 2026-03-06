import { Card, Box, Text, Flex, Badge, Separator } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AssignmentAuthorActions } from "@/app/components/assignment-author-actions";
import { AssignmentActionButton } from "@/app/components/assignment-action-button";
import { formatDateToLocal } from "@/lib/timezone";

async function getAssignment(id: string, userId: string, userEmail?: string) {
  const supabase = await createSupabaseServer();

  // Get assignment authored by the user
  const { data: assignment } = await supabase
    .from("assignments")
    .select(
      "id, title, description, deadline, visibility, created_at, creator_id",
    )
    .eq("id", id)
    .eq("creator_id", userId)
    .single();

  if (assignment) {
    // Assignment authored by user
    let fullAssignment: any = assignment;
    const { data: claim } = await supabase
      .from("assignment_claims")
      .select("status")
      .eq("assignment_id", assignment.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (claim?.status) {
      fullAssignment.claimStatus = claim.status;
    }
    if (assignment.visibility === "restricted") {
      const { data: allowedUsers } = await supabase
        .from("assignment_allowed_users")
        .select("user_id")
        .eq("assignment_id", assignment.id)
        .limit(1)
        .maybeSingle();

      if (allowedUsers?.user_id) {
        const { data: userEmail } = await supabase.rpc("get_user_email_by_id", {
          user_id: allowedUsers.user_id,
        });

        if (userEmail) {
          fullAssignment.assignedEmail = userEmail;
        }
      }
    }
    return { assignment: fullAssignment, isAuthor: true, error: null };
  }

  // Get assigned assignment
  const { data: claim } = await supabase
    .from("assignment_claims")
    .select(
      `
      status,
      assignments:assignment_id (
        id,
        title,
        description,
        deadline,
        visibility,
        created_at,
        creator_id
      )
    `,
    )
    .eq("assignment_id", id)
    .eq("user_id", userId)
    .single();

  if (claim && claim.assignments) {
    const assignment = Array.isArray(claim.assignments)
      ? claim.assignments[0]
      : claim.assignments;
    let creatorEmail: string | null = null;

    // Get creator email
    if (assignment.creator_id) {
      const { data: email } = await supabase.rpc("get_user_email_by_id", {
        user_id: assignment.creator_id,
      });
      creatorEmail = email;
    }

    return {
      assignment: {
        ...assignment,
        claimStatus: claim.status,
        ...(assignment.visibility === "restricted" &&
          userEmail && { assignedEmail: userEmail }),
        ...(creatorEmail && { creator_email: creatorEmail }),
      },
      isAuthor: false,
      error: null,
    };
  }

  return { assignment: null, isAuthor: false, error: "Assignment not found" };
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

  const { assignment, isAuthor, error } = await getAssignment(
    id,
    user.id,
    user.email ?? undefined,
  );

  if (error || !assignment) {
    redirect("/dashboard/assignments");
  }

  return (
    <div className="p-4 min-w-xl">
      <Box className="mt-4 mb-10">
        <Flex align="center" gap="2" className="mb-6">
          {isAuthor ? (
            <Link href="/dashboard/assignments?tab=authored">
              <h1 className="text-3xl font-bold text-(--gray-9) hover:underline hover:text-(--color-text)">
                Assignments
              </h1>
            </Link>
          ) : (
            <Link href="/dashboard/assignments">
              <h1 className="text-3xl font-bold text-(--gray-9) hover:underline hover:text-(--color-text)">
                Assignments
              </h1>
            </Link>
          )}
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
            {getStatusBadge(
              (assignment as any).claimStatus || (assignment as any).status,
            )}
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
            {!isAuthor && (assignment as any).creator_email && (
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
            )}
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

          {isAuthor ? (
            <AssignmentAuthorActions
              assignment={{
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                deadline: assignment.deadline,
                visibility: assignment.visibility,
                assignedEmail: (assignment as any).assignedEmail,
              }}
            />
          ) : (
            <AssignmentActionButton
              assignmentId={assignment.id}
              isTaken={!!(assignment as any).claimStatus}
              status={(assignment as any).claimStatus}
            />
          )}
        </Flex>
      </Card>
    </div>
  );
}
