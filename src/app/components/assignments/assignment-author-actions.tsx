"use client";

import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { DeleteAssignment } from "@/app/actions/assignments/delete-assignment";
import { EditAssignmentDialog } from "@/app/components/assignments/edit-assignment-dialog";

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
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red">
            <TrashIcon />
            Delete
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="700px">
          <AlertDialog.Title>Delete assignment</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure you want to delete <strong> {assignment.title}</strong>
            ? This action is permanent and cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <form action={DeleteAssignment}>
              <input type="hidden" name="id" value={assignment.id} />
              <AlertDialog.Action>
                <Button variant="solid" color="red" type="submit">
                  Delete
                </Button>
              </AlertDialog.Action>
            </form>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}
