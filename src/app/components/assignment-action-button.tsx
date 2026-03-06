"use client";

import { Button, Spinner, Flex, Tabs } from "@radix-ui/themes";
import { TakeAssignment } from "@/app/actions/take-assignment";
import { UntakeAssignment } from "@/app/actions/untake-assignment";
import { UpdateAssignmentStatus } from "@/app/actions/update-assignment-status";
import { useState } from "react";

type ClaimStatus = "accepted" | "in_progress" | "finished";

export function AssignmentActionButton({
  assignmentId,
  isTaken: initialIsTaken,
  status: initialStatus,
}: {
  assignmentId: string;
  isTaken?: boolean;
  status?: ClaimStatus;
}) {
  const [isTaken, setIsTaken] = useState(initialIsTaken || false);
  const [status, setStatus] = useState<ClaimStatus | undefined>(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleTake = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      const result = await TakeAssignment(formData);
      if (result.success) {
        setIsTaken(true);
        setStatus("accepted");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUntake = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      const result = await UntakeAssignment(formData);
      if (result.success) {
        setIsTaken(false);
        setStatus(undefined);
      } else {
        console.error("Untake error:", result.error);
      }
    } catch (err) {
      console.error("Untake exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ClaimStatus) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("status", newStatus);
      const result = await UpdateAssignmentStatus(formData);
      if (result.success) {
        setStatus(newStatus);
      } else {
        console.error("Status update error:", result.error);
      }
    } catch (err) {
      console.error("Status update exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTaken) {
    const getTabColor = () => {
      switch (status) {
        case "accepted":
          return "blue";
        case "in_progress":
          return "amber";
        case "finished":
          return "green";
        default:
          return "gray";
      }
    };

    return (
      <Flex gap="3" wrap="wrap" align="center">
        <Tabs.Root
          value={status}
          onValueChange={(value) => handleStatusUpdate(value as ClaimStatus)}
        >
          <Tabs.List color={getTabColor()} size="1">
            <Tabs.Trigger disabled={isLoading} value="accepted">
              Accepted
            </Tabs.Trigger>
            <Tabs.Trigger disabled={isLoading} value="in_progress">
              In Progress
            </Tabs.Trigger>
            <Tabs.Trigger disabled={isLoading} value="finished">
              Completed
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <Button
          color="red"
          onClick={handleUntake}
          disabled={isLoading}
          variant="soft"
        >
          {isLoading && <Spinner />}
          Release Assignment
        </Button>
      </Flex>
    );
  }

  return (
    <Button onClick={handleTake} disabled={isLoading}>
      {isLoading && <Spinner />}
      Take Assignment
    </Button>
  );
}
