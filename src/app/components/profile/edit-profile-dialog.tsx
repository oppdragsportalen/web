"use client";

import { useState } from "react";
import {
  Dialog,
  Button,
  Flex,
  TextField,
  Text,
  Callout,
} from "@radix-ui/themes";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { updateProfile } from "@/app/actions/profile/update-profile";

interface EditProfileDialogProps {
  displayName: string;
  username: string;
  email: string;
  loadData?: () => void;
}

export function EditProfileDialog({
  displayName,
  username,
  email,
  loadData,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      if (result.emailUpdatePending) {
        setInfo("Email change requested. Please confirm via the email link.");
        setIsLoading(false);
      } else {
        setOpen(false);
        setIsLoading(false);
        loadData?.();
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Flex gap="3" mt="2">
        <Dialog.Trigger>
          <Button type="button" variant="solid" className="flex-1">
            <Pencil2Icon />
            Edit profile
          </Button>
        </Dialog.Trigger>
      </Flex>

      <Dialog.Content maxWidth="450px" className="min-w-80">
        <Dialog.Title>Edit profile</Dialog.Title>

        <form action={handleSubmit} aria-label="Edit profile form">
          <Flex direction="column" gap="3">
            <label htmlFor="displayName">
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                id="displayName"
                name="displayName"
                defaultValue={displayName}
                size="3"
                required
                aria-required="true"
                aria-label="Display name"
              />
            </label>
            <label htmlFor="username">
              <Text as="div" size="2" mb="1" weight="bold">
                Username
              </Text>
              <TextField.Root
                id="username"
                name="username"
                defaultValue={username}
                size="3"
                required
                aria-required="true"
                aria-label="Username"
              />
            </label>
            <label htmlFor="email">
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root
                id="email"
                name="email"
                defaultValue={email}
                size="3"
                aria-label="Email address"
                disabled
              />
            </label>
            {error && (
              <Callout.Root color="red" size="1" id="error-message">
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}
            {info && (
              <Text color="gray" size="2">
                {info}
              </Text>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="submit"
              disabled={isLoading}
              aria-label={
                isLoading ? "Saving changes, please wait" : "Save changes"
              }
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
