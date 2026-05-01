"use client";

import { useState } from "react";
import { Dialog, Flex, Button, TextField, Box, Text } from "@radix-ui/themes";
import { getDMRoom } from "@/app/actions/messages/get-dm-room";
import { createDMRoom } from "@/app/actions/messages/create-dm-room";
import { useRouter } from "next/navigation";

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
      <Dialog.Trigger>
        {trigger || <Button>Start New Chat</Button>}
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Start New Chat</Dialog.Title>
        <Dialog.Description>
          Enter the username of the person you want to message
        </Dialog.Description>

        <Box className="my-4">
          <TextField.Root
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleStart();
              }
            }}
            disabled={isLoading}
          />
          {error && (
            <Text color="red" size="2" mt="8">
              {error}
            </Text>
          )}
        </Box>

        <Flex justify="end" gap="2">
          <Dialog.Close>
            <Button variant="soft">Cancel</Button>
          </Dialog.Close>
          <Button onClick={handleStart} disabled={isLoading}>
            {isLoading ? "Loading..." : "Start Chat"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
