"use client";

import { useEffect, useState } from "react";
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
import { Pencil1Icon } from "@radix-ui/react-icons";
import { UpdateAssignment } from "@/app/actions/update-assignment";

function UpdateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Update
    </Button>
  );
}

type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  visibility: "public" | "restricted";
  assignedEmail?: string;
};

export function EditAssignmentDialog({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isRestricted, setIsRestricted] = useState(
    assignment.visibility === "restricted",
  );
  const [assignedEmail, setAssignedEmail] = useState(
    assignment.assignedEmail || "",
  );

  useEffect(() => {
    if (open) {
      setIsRestricted(assignment.visibility === "restricted");
      setAssignedEmail(assignment.assignedEmail || "");
    }
  }, [open, assignment.visibility, assignment.assignedEmail]);

  const handleSubmit = async (formData: FormData) => {
    setError("");

    formData.append("visibility", isRestricted ? "restricted" : "public");
    if (isRestricted) {
      formData.append("assignedEmail", formData.get("assignedEmail") as string);
    }

    const result = await UpdateAssignment(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  };

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>
        <Button>
          <Pencil1Icon />
          Edit
        </Button>
      </AlertDialog.Trigger>

      <AlertDialog.Content style={{ transition: "height 0.2s ease-in-out" }}>
        <AlertDialog.Title>Edit Assignment</AlertDialog.Title>

        <form
          action={handleSubmit}
          style={{ transition: "all 0.2s ease-in-out" }}
          aria-label="Edit assignment form"
        >
          <input type="hidden" name="id" value={assignment.id} />
          <Flex direction="column" gap="3">
            <label htmlFor="title">
              <Text as="div" size="2" mb="1" weight="bold">
                Title
              </Text>
              <TextField.Root
                id="title"
                name="title"
                size="3"
                required
                aria-required="true"
                aria-label="Assignment title"
                defaultValue={assignment.title}
              />
            </label>

            <label htmlFor="description">
              <Text as="div" size="2" mb="1" weight="bold">
                Description
              </Text>
              <TextArea
                id="description"
                name="description"
                size="3"
                rows={3}
                style={{ maxHeight: "12em", resize: "vertical" }}
                aria-label="Assignment description"
                defaultValue={assignment.description}
              />
            </label>

            <label htmlFor="deadline">
              <Text as="div" size="2" mb="1" weight="bold">
                Deadline
              </Text>
              <TextField.Root
                id="deadline"
                type="datetime-local"
                name="deadline"
                size="3"
                required
                aria-required="true"
                aria-label="Assignment deadline"
                aria-describedby="deadline-hint"
                defaultValue={new Date(assignment.deadline)
                  .toISOString()
                  .slice(0, 16)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </label>

            <div>
              <Text
                as="div"
                size="2"
                mb="2"
                weight="bold"
                id="assignment-type-label"
              >
                Assignment Type
              </Text>
              <SegmentedControl.Root
                value={isRestricted ? "restricted" : "public"}
                onValueChange={(value) =>
                  setIsRestricted(value === "restricted")
                }
                aria-label="Choose assignment type"
                aria-describedby="assignment-type-label"
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
              <label htmlFor="assignedEmail">
                <Text as="div" size="2" mb="1" weight="bold">
                  Assign to user
                </Text>
                <TextField.Root
                  id="assignedEmail"
                  name="assignedEmail"
                  type="email"
                  placeholder="user@example.com"
                  size="3"
                  required={isRestricted}
                  aria-required={isRestricted}
                  aria-label="User email address"
                  value={assignedEmail}
                  onChange={(e) => setAssignedEmail(e.target.value)}
                  disabled={!isRestricted}
                  tabIndex={isRestricted ? 0 : -1}
                />
              </label>
            </div>

            {error && (
              <Callout.Root color="red" role="alert" aria-live="polite">
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
            <UpdateButton />
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
