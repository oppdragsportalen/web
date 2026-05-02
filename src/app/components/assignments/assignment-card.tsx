import Link from "next/link";
import { Card, Box, Text, Badge, Flex, Tooltip } from "@radix-ui/themes";
import { formatDateToLocal } from "@/lib/timezone";
import type { Profile } from "@/types";

type Props = {
  assignment: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    creator_profile?: Profile;
    assigned_profile?: Profile;
    visibility: string;
    status?: "not_taken" | "accepted" | "in_progress" | "finished";
  };
  detailsHref: string;
};

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

function getVisibilityBadge(visibility: string) {
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

export function AssignmentCard({ assignment, detailsHref }: Props) {
  return (
    <Link href={detailsHref} style={{ textDecoration: "none" }}>
      <Card className="mb-3 p-3 cursor-pointer hover:outline outline-(--accent-8) -outline-offset-1">
        <Flex justify="between" align="center" className="mb-2">
          <Text className="font-medium">{assignment.title}</Text>
          <Flex gap="2">
            {getVisibilityBadge(assignment.visibility)}
            {getStatusBadge(assignment.status)}
          </Flex>
        </Flex>
        <Flex justify="between">
          <Box>
            <Text size="2" color="gray">
              Due:{" "}
              {formatDateToLocal(assignment.deadline, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
          </Box>
          {assignment.assigned_profile && (
            <Box>
              <Tooltip
                content={
                  <span>
                    Assigned to{" "}
                    <strong>{assignment.assigned_profile?.username}</strong>{" "}
                    {assignment.assigned_profile?.display_name}
                  </span>
                }
              >
                <Text size="2" color="gray">
                  {assignment.assigned_profile.username}
                </Text>
              </Tooltip>
            </Box>
          )}
          {assignment.creator_profile && (
            <Box>
              <Tooltip
                content={
                  <span>
                    Created by{" "}
                    <strong>{assignment.creator_profile?.username}</strong>{" "}
                    {assignment.creator_profile?.display_name}
                  </span>
                }
              >
                <Text size="2" color="gray">
                  {assignment.creator_profile.username}
                </Text>
              </Tooltip>
            </Box>
          )}
        </Flex>
      </Card>
    </Link>
  );
}
