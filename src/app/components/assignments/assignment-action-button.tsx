"use client";

import { Flex } from "@radix-ui/themes";
import { TakeAssignment } from "@/app/actions/assignments/take-assignment";
import { UntakeAssignment } from "@/app/actions/assignments/untake-assignment";
import { UpdateAssignmentStatus } from "@/app/actions/assignments/update-assignment-status";
import { useState } from "react";
import type { ClaimStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserMinus } from "lucide-react";

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
    return (
      <Flex gap="3" wrap="wrap" align="center">
        {isLoading && <Spinner />}
        <Tabs
          value={status}
          onValueChange={(value) => handleStatusUpdate(value as ClaimStatus)}
        >
          <TabsList className="bg-muted p-1">
            <TabsTrigger
              value="accepted"
              className="
                data-[state=active]:bg-green-100
                data-[state=active]:text-green-700
                dark:data-[state=active]:bg-green-950
                dark:data-[state=active]:text-green-300
              "
            >
              Accepted
            </TabsTrigger>

            <TabsTrigger
              value="in_progress"
              className="
                data-[state=active]:bg-amber-100
                data-[state=active]:text-amber-700
                dark:data-[state=active]:bg-amber-950
                dark:data-[state=active]:text-amber-300
              "
            >
              In Progress
            </TabsTrigger>

            <TabsTrigger
              value="finished"
              className="
                data-[state=active]:bg-blue-100
                data-[state=active]:text-blue-700
                dark:data-[state=active]:bg-blue-950
                dark:data-[state=active]:text-blue-300
              "
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Release Assignment</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <UserMinus />
              </AlertDialogMedia>
              <AlertDialogTitle>Release assignment?</AlertDialogTitle>
              <AlertDialogDescription>
                This will unassign you from this assignment. You can take it
                again later if available.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form action={handleUntake}>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  type="submit"
                  disabled={isLoading}
                >
                  Release
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
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
