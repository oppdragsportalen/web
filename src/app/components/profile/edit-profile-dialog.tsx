"use client";

import { useState } from "react";
import { Flex } from "@radix-ui/themes";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { updateProfile } from "@/app/actions/profile/update-profile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <Flex gap="3" mt="2">
        <DialogTrigger asChild>
          <Button>
            <Pencil2Icon />
            Edit profile
          </Button>
        </DialogTrigger>
      </Flex>

      <DialogContent className="min-w-80">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} aria-label="Edit profile form">
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={displayName}
                required
                aria-required="true"
                aria-label="Display name"
              />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                id="username"
                name="username"
                defaultValue={username}
                required
                aria-required="true"
                aria-label="Username"
              />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                id="email"
                name="email"
                defaultValue={email}
                aria-label="Email address"
                disabled
              />
            </Field>
            <Field>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <>
                    <TriangleAlert />
                    <AlertTitle>{error}</AlertTitle>
                  </>
                </Alert>
              )}
            </Field>
            <Field>
              {info && (
                <Alert className="mb-4">
                  <AlertTitle>{info}</AlertTitle>
                </Alert>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isLoading}
              aria-label={
                isLoading ? "Saving changes, please wait" : "Save changes"
              }
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
