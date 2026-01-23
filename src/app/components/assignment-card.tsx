import Link from "next/link";
import { Card, Box, Text, Badge, Flex } from "@radix-ui/themes";

type Props = {
  assignment: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    visibility: string;
    status?: "not_taken" | "accepted" | "in_progress" | "finished";
  };
  detailsHref: string;
};

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

function getVisibilityBadge(visibility: string) {
  switch (visibility) {
    case "public":
      return <Badge color="cyan">Public</Badge>;
    default:
      return <Badge color="gray" variant="outline">Restricted</Badge>;
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
        <Box>
          <Text size="2" color="gray">
            Due:{" "}
            {new Date(assignment.deadline).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Box>
      </Card>
    </Link>
  );
}
