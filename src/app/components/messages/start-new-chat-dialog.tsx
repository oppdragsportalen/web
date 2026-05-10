"use client";

import { useState } from "react";
import {
  Dialog,
  Flex,
  Button,
  TextField,
  Box,
  Text,
  Callout,
  Spinner,
  IconButton,
} from "@radix-ui/themes";
import { getDMRoom } from "@/app/actions/messages/get-dm-room";
import { createDMRoom } from "@/app/actions/messages/create-dm-room";
import { useRouter } from "next/navigation";
import {
  ExclamationTriangleIcon,
  Cross1Icon,
  ArrowRightIcon,
} from "@radix-ui/react-icons";

type StartNewChatDialogProps = {
  trigger?: React.ReactNode;
};

export function StartNewChatDialog({ trigger }: StartNewChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    setError("");
    setIsLoading(true);

    const existingRoomResult = await getDMRoom(username);

    if (existingRoomResult.error) {
      setIsLoading(false);
      setError(existingRoomResult.error);
      return;
    }

    const result = existingRoomResult.roomId
      ? existingRoomResult
      : await createDMRoom(username);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    setUsername("");
    router.push(`/dashboard/messages/${result.roomId}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{trigger || <Button>New Message</Button>}</Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>
          <Flex justify="between">
            <Text>New Message</Text>
            <Dialog.Close>
              <IconButton variant="ghost" color="gray">
                <Cross1Icon />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>
        <Dialog.Description>
          Enter the username of the person you want to message
        </Dialog.Description>

        <Box className="mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStart();
            }}
          >
            <Flex gap="2">
              <TextField.Root
                className="flex-1"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                disabled={isLoading}
                required
              />
              <IconButton type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : <ArrowRightIcon />}
              </IconButton>
            </Flex>
          </form>

          {error && (
            <Callout.Root
              color="red"
              mt="2"
              size="1"
              role="alert"
              aria-live="polite"
            >
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
        </Box>

        {/* <Flex justify="end" gap="2">
          <Dialog.Close>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button onClick={handleStart} disabled={isLoading}>
            {isLoading ? "Loading..." : "Start Conversation"}
          </Button>
        </Flex> */}
      </Dialog.Content>
    </Dialog.Root>
  );
}
