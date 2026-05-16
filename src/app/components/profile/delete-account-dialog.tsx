"use client";

import { useState } from "react";
import { DeleteProfile } from "@/app/actions/profile/delete-profile";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = confirmText === "Delete my account";

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError('Please type "Delete my account" to confirm');
      return;
    }

    setError("");
    setIsDeleting(true);
    const result = await DeleteProfile(new FormData());
    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setConfirmText("");
          setError("");
          setIsDeleting(false);
        }
      }}
    >
      <AlertDialogContent size="sm" className="min-w-80">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <TriangleAlert />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
        </AlertDialogHeader>
        <Alert className="mb-4" variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            All your profile data and assignments will be permanently deleted.
          </AlertTitle>
        </Alert>
        <FieldGroup>
          <Field>
            <FieldLabel>
              Type<strong>&quot;Delete my account&quot;</strong>
            </FieldLabel>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              placeholder="Delete my account"
              aria-label="Confirmation text"
              aria-required="true"
              autoComplete="off"
            />
          </Field>
          {error && (
            <Field>
              <Alert className="mb-4" variant="destructive">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            </Field>
          )}
        </FieldGroup>
        <form onSubmit={handleDelete}>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              variant="destructive"
              type="submit"
              disabled={!isValid || isDeleting}
            >
              {isDeleting && <Spinner />}
              Delete Account
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
