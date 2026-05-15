"use client";

import { Flex } from "@radix-ui/themes";
import { DeleteAssignment } from "@/app/actions/assignments/delete-assignment";
import { EditAssignmentDialog } from "@/app/components/assignments/edit-assignment-dialog";
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";

type Props = {
  assignment: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    visibility: "public" | "restricted";
    assignedUsername?: string;
  };
};

export function AssignmentAuthorActions({ assignment }: Props) {
  return (
    <Flex gap="3">
      <EditAssignmentDialog assignment={assignment} />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <Trash2 />
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete assignment?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong> {assignment.title}</strong>? This action is permanent and
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={DeleteAssignment}>
            <input type="hidden" name="id" value={assignment.id} />
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" type="submit">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
