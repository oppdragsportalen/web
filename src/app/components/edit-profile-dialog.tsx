"use client";

import { useState } from "react";
import { Dialog, Button, Flex, TextField, Text } from "@radix-ui/themes";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { updateProfile } from "@/app/actions/update-profile";

interface EditProfileDialogProps {
  displayName: string;
  email: string;
}

export function EditProfileDialog({
  displayName,
  email,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setOpen(false);
      setIsLoading(false);
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

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Edit profile</Dialog.Title>

        <form action={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Name
              </Text>
              <TextField.Root
                name="displayName"
                defaultValue={displayName}
                required
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Email
              </Text>
              <TextField.Root defaultValue={email} disabled />
            </label>
            {error && (
              <Text color="red" size="2">
                {error}
              </Text>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray" type="button">
                Cancel
              </Button>
            </Dialog.Close>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
