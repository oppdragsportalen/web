"use client";

import { Button, Spinner } from "@radix-ui/themes";
import { TakeAssignment } from "@/app/actions/take-assignment";
import { UntakeAssignment } from "@/app/actions/untake-assignment";
import { useState } from "react";

export function AssignmentActionButton({
  assignmentId,
  isTaken: initialIsTaken,
}: {
  assignmentId: string;
  isTaken?: boolean;
}) {
  const [isTaken, setIsTaken] = useState(initialIsTaken || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTake = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      const result = await TakeAssignment(formData);
      if (result.success) {
        setIsTaken(true);
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
      } else {
        console.error("Untake error:", result.error);
      }
    } catch (err) {
      console.error("Untake exception:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTaken) {
    return (
      <Button
        color="red"
        onClick={handleUntake}
        disabled={isLoading}
        variant="soft"
      >
        {isLoading ? <Spinner /> : "Untake"}
      </Button>
    );
  }

  return (
    <Button onClick={handleTake} disabled={isLoading}>
      {isLoading ? <Spinner /> : "Take Assignment"}
    </Button>
  );
}
