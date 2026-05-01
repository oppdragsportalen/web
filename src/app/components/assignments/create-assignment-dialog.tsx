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
import { CreateAssignment } from "@/app/actions/assignments/create-assignment";
import {
  getLocalNowDatetime,
  getLocalDefaultDatetime,
  getLocalMaxDatetime,
  localDatetimeToUTC,
} from "@/lib/timezone";

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

    // Convert local datetime to UTC
    const deadlineLocal = formData.get("deadline") as string;
    const deadlineUTC = localDatetimeToUTC(deadlineLocal);
    if (!deadlineUTC) {
      setError("Invalid deadline format");
      return;
    }
    formData.set("deadline", deadlineUTC);

    formData.append("visibility", isRestricted ? "restricted" : "public");
    if (isRestricted) {
      formData.append(
        "assignedUsername",
        formData.get("assignedUsername") as string,
      );
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
          aria-label="Create assignment form"
        >
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
                defaultValue={getLocalDefaultDatetime()}
                min={getLocalNowDatetime()}
                max={getLocalMaxDatetime()}
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
              <label htmlFor="assignedUsername">
                <Text as="div" size="2" mb="1" weight="bold">
                  Assign to user
                </Text>
                <TextField.Root
                  id="assignedUsername"
                  name="assignedUsername"
                  placeholder="username"
                  size="3"
                  required={isRestricted}
                  aria-required={isRestricted}
                  aria-label="Assigned username"
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
            <SubmitButton />
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
