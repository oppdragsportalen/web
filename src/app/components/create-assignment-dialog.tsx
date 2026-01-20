"use client";

import { useState } from "react";
import {
  AlertDialog,
  Button,
  Flex,
  TextField,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { CreateAssignment } from "@/app/actions/create-assignment";

export function CreateAssignmentDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);

    formData.append("visibility", isRestricted ? "restricted" : "public");
    if (isRestricted) {
      formData.append(
        "assignedEmail",
        formData.get("assignedEmail") as string,
      );
    }

    const result = await CreateAssignment(formData);

    setLoading(false);

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
              <TextField.Root
                name="title"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                name="description"
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Deadline
              </Text>
              <TextField.Root type="datetime-local" name="deadline" required />
            </label>

            <Flex gap="3" align="center">
              <label style={{ display: "flex", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={!isRestricted}
                  onChange={() => setIsRestricted(false)}
                />
                <Text size="2">Public</Text>
              </label>
              <label style={{ display: "flex", gap: "8px", cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={isRestricted}
                  onChange={() => setIsRestricted(true)}
                />
                <Text size="2">Restricted</Text>
              </label>
            </Flex>

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
              <Text color="red" size="2">
                {error}
              </Text>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
