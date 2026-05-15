"use client";

import { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { getDMRoom } from "@/app/actions/messages/get-dm-room";
import { createDMRoom } from "@/app/actions/messages/create-dm-room";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { TriangleAlert, ArrowRight } from "lucide-react";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger || <Button>New Message</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Enter the username of the person you want to message
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <FieldGroup>
            <Field>
              <Flex className="gap-2">
                <Input
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
                <Button
                  type="submit"
                  size="icon"
                  variant="default"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner /> : <ArrowRight />}
                </Button>
              </Flex>
            </Field>
            {error && (
              <Field>
                <Alert variant="destructive">
                  <>
                    <TriangleAlert />
                    <AlertTitle>{error}</AlertTitle>
                  </>
                </Alert>
              </Field>
            )}
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
