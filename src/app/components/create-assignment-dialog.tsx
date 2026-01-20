"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertDialog,
  Button,
  Callout,
  Flex,
  SegmentedControl,
  TextField,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { PlusIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CreateAssignment } from "@/app/actions/create-assignment";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Create
    </Button>
  );
}

export function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isRestricted, setIsRestricted] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");

    formData.append("visibility", isRestricted ? "restricted" : "public");
    if (isRestricted) {
      formData.append("assignedEmail", formData.get("assignedEmail") as string);
    }

    const result = await CreateAssignment(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      setIsRestricted(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>
        <Button variant="solid" className="w-full">
          <PlusIcon /> Create Assignment
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content>
        <AlertDialog.Title>Create New Assignment</AlertDialog.Title>

        <form action={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root name="title" required />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea name="description" />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Deadline
              </Text>
              <TextField.Root type="datetime-local" name="deadline" required />
            </label>

            <div>
              <Text as="div" size="2" mb="2" weight="bold">
                Assignment Type
              </Text>
              <SegmentedControl.Root
                value={isRestricted ? "restricted" : "public"}
                onValueChange={(value) =>
                  setIsRestricted(value === "restricted")
                }
              >
                <SegmentedControl.Item value="public">
                  Public
                </SegmentedControl.Item>
                <SegmentedControl.Item value="restricted">
                  Restricted
                </SegmentedControl.Item>
              </SegmentedControl.Root>
            </div>

            {isRestricted && (
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Assign to user
                </Text>
                <TextField.Root
                  name="assignedEmail"
                  type="email"
                  placeholder="user@example.com"
                  required
                />
              </label>
            )}

            {error && (
              <Callout.Root color="red">
                <Callout.Icon>
                  <ExclamationTriangleIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <SubmitButton />
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
