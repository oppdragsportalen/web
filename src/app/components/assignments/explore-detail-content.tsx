import { Box, Text, Flex, Separator } from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AssignmentActionButton } from "@/app/components/assignments/assignment-action-button";
import { formatDateToLocal } from "@/lib/timezone";
import type { Assignment, ClaimStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Globe,
  Lock,
  Check,
  Clock,
  CheckCircle,
  PlusCircle,
} from "lucide-react";

async function getAssignment(
  id: string,
  userId: string,
): Promise<{
  assignment: Assignment | null;
  error: { message: string } | null;
}> {
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

  let assignedProfile = null;
  let creatorProfile = null;

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

    // Get assigned user profile for restricted assignments
    if (allowed?.user_id) {
      const { data: profiles } = await supabase.rpc("get_profiles_by_ids", {
        user_ids: [allowed.user_id],
      });
      if (profiles && profiles.length > 0) {
        assignedProfile = profiles[0];
      }
    }
  }

  // Get creator profile
  if (assignment.creator_id) {
    const { data: profiles } = await supabase.rpc("get_profiles_by_ids", {
      user_ids: [assignment.creator_id],
    });
    if (profiles && profiles.length > 0) {
      creatorProfile = profiles[0];
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
    assignment: {
      ...assignment,
      claimStatus: claim?.status as any,
      ...(assignedProfile && { assigned_profile: assignedProfile }),
      ...(creatorProfile && { creator_profile: creatorProfile }),
    },
    error: null,
  };
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
          <Check data-icon="inline-start" />
          Accepted
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          <Clock data-icon="inline-start" />
          In Progress
        </Badge>
      );
    case "finished":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <CheckCircle data-icon="inline-start" />
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <PlusCircle data-icon="inline-start" />
          Available
        </Badge>
      );
  }
}

function getVisibilityBadge(visibility: string) {
  switch (visibility) {
    case "public":
      return (
        <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
          <Globe data-icon="inline-start" />
          Public
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Lock data-icon="inline-start" />
          Restricted
        </Badge>
      );
  }
}

export default async function ExploreDetailPage({ id }: { id: string }) {
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
    <div>
      <Box className="mt-4 mb-10">
        <Flex align="center" gap="4" className="mb-6">
          <Link href="/dashboard/explore">
            <Button size="icon" className="cursor-pointer">
              <ArrowLeftIcon />
            </Button>
          </Link>

          <h1 className="text-3xl max-sm:text-xl font-bold wrap-break-word whitespace-normal min-w-0">
            {assignment.title}
          </h1>
        </Flex>
      </Box>

      <Card>
        <CardHeader>
          <Flex
            justify="between"
            align="start"
            gap="4"
            mb="5"
            className="max-sm:flex-col-reverse"
          >
            <Box>
              <Text size="5" weight="bold" className="leading-tight">
                {assignment.title}
              </Text>
            </Box>

            <Flex gap="2" wrap="wrap" align="center">
              {getVisibilityBadge(assignment.visibility)}
              {getStatusBadge(assignment.claimStatus)}
            </Flex>
          </Flex>
        </CardHeader>
        <CardContent>
          {assignment.description && (
            <Box mb="5">
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Description
                </Text>
              </Box>
              <Card>
                <CardContent>
                  <Text size="2">{assignment.description}</Text>
                </CardContent>
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
                  <CardContent>
                    <Text size="2" className="whitespace-nowrap">
                      {formatDateToLocal(assignment.deadline)}
                    </Text>
                  </CardContent>
                </Card>
              </Box>
              <Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">
                    Status
                  </Text>
                </Box>
                <Card>
                  <CardContent>
                    <Text size="2" className="capitalize whitespace-nowrap">
                      {(() => {
                        const status = assignment.claimStatus;
                        if (status === "accepted") return "Accepted";
                        if (status === "in_progress") return "In Progress";
                        if (status === "finished") return "Completed";
                        return "Available";
                      })()}
                    </Text>
                  </CardContent>
                </Card>
              </Box>
              <Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">
                    Assignment Type
                  </Text>
                </Box>
                <Card>
                  <CardContent>
                    <Text size="2" className="capitalize whitespace-nowrap">
                      {assignment.visibility}
                    </Text>
                  </CardContent>
                </Card>
              </Box>
              {assignment.creator_profile && (
                <Box>
                  <Box>
                    <Text size="2" weight="medium" color="gray">
                      Created By
                    </Text>
                  </Box>
                  <Card>
                    <CardContent>
                      <Text size="2" className="whitespace-nowrap">
                        <Badge variant="outline" color="gray">
                          <strong>{assignment.creator_profile.username}</strong>
                        </Badge>{" "}
                        {assignment.creator_profile.display_name}
                      </Text>
                    </CardContent>
                  </Card>
                </Box>
              )}
              {assignment.visibility === "restricted" &&
                assignment.assigned_profile && (
                  <Box>
                    <Box>
                      <Text size="2" weight="medium" color="gray">
                        Assigned To
                      </Text>
                    </Box>
                    <Card>
                      <CardContent>
                        <Text size="2" className="whitespace-nowrap">
                          <Badge variant="outline" color="gray">
                            <strong>
                              {assignment.assigned_profile.username}
                            </strong>
                          </Badge>{" "}
                          {assignment.assigned_profile.display_name}
                        </Text>
                      </CardContent>
                    </Card>
                  </Box>
                )}
            </div>
          </Box>
        </CardContent>
        <CardFooter>
          <Flex
            justify="between"
            align="center"
            gap="3"
            wrap="wrap"
            className="w-full"
          >
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
              isTaken={!!assignment.claimStatus}
              status={assignment.claimStatus}
            />
          </Flex>
        </CardFooter>
      </Card>
    </div>
  );
}
