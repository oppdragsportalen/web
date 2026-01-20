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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CreateAssignment } from "@/app/actions/create-assignment";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Create
    </Button>
  );
}

export function CreateAssignmentDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
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
      <AlertDialog.Trigger>{trigger}</AlertDialog.Trigger>

      <AlertDialog.Content style={{ transition: "height 0.2s ease-in-out" }}>
        <AlertDialog.Title>Create New Assignment</AlertDialog.Title>

        <form
          action={handleSubmit}
          style={{ transition: "all 0.2s ease-in-out" }}
        >
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root name="title" size="3" required />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                name="description"
                size="3"
                rows={3}
                style={{ maxHeight: "12em", resize: "vertical" }}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Deadline
              </Text>
              <Text as="div" size="1" color="gray" mb="1">
                Click to select date and time
              </Text>
              <TextField.Root
                type="datetime-local"
                name="deadline"
                size="3"
                required
              />
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

            <div
              style={{
                maxHeight: isRestricted ? "200px" : "0",
                overflow: "hidden",
                transition:
                  "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
                opacity: isRestricted ? 1 : 0,
              }}
            >
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Assign to user
                </Text>
                <TextField.Root
                  name="assignedEmail"
                  type="email"
                  placeholder="user@example.com"
                  size="3"
                  required={isRestricted}
                />
              </label>
            </div>

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
