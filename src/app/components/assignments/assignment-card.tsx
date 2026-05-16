import Link from "next/link";
import { Box, Text, Flex } from "@radix-ui/themes";
import { formatDateToLocal } from "@/lib/timezone";
import type { Profile } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Globe,
  Lock,
  Check,
  Clock,
  CheckCircle,
  PlusCircle,
} from "lucide-react";

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

export function AssignmentCard({ assignment, detailsHref }: Props) {
  return (
    <Link href={detailsHref} style={{ textDecoration: "none" }}>
      <Card className="cursor-pointer hover:outline outline-(--accent-8) mb-3">
        <CardHeader>
          <Flex
            justify="between"
            align="center"
            className="max-sm:flex-col-reverse max-sm:items-start! max-sm:gap-2"
          >
            <CardTitle>{assignment.title}</CardTitle>
            <Box>
              <Flex gap="2">
                {getVisibilityBadge(assignment.visibility)}
                {getStatusBadge(assignment.status)}
              </Flex>
            </Box>
          </Flex>
        </CardHeader>
        <CardContent>
          <Flex justify="between" align="end">
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
              <Flex align="center" gap="2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={assignment.assigned_profile.avatar_url || undefined}
                    alt={
                      assignment.assigned_profile.display_name ||
                      assignment.assigned_profile.username
                    }
                  />
                  <AvatarFallback>
                    {assignment.assigned_profile.username
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipContent>
                      <span>
                        Assigned to{" "}
                        <strong>{assignment.assigned_profile?.username}</strong>{" "}
                        {assignment.assigned_profile?.display_name}
                      </span>
                    </TooltipContent>
                    <TooltipTrigger>
                      <Text size="2" color="gray">
                        {assignment.assigned_profile.username}
                      </Text>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </Flex>
            )}
            {assignment.creator_profile && (
              <Flex align="center" gap="2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={assignment.creator_profile.avatar_url || undefined}
                    alt={
                      assignment.creator_profile.display_name ||
                      assignment.creator_profile.username
                    }
                  />
                  <AvatarFallback>
                    {assignment.creator_profile.username
                      .charAt(0)
                      .toUpperCase()}{" "}
                  </AvatarFallback>
                </Avatar>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipContent>
                      <span>
                        Created by{" "}
                        <strong>{assignment.creator_profile?.username}</strong>{" "}
                        {assignment.creator_profile?.display_name}
                      </span>
                    </TooltipContent>
                    <TooltipTrigger>
                      <Text size="2" color="gray">
                        {assignment.creator_profile.username}
                      </Text>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </Flex>
            )}
          </Flex>
        </CardContent>
      </Card>
    </Link>
  );
}
