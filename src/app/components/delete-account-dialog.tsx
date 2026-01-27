"use client";

import { useState } from "react";
import {
  AlertDialog,
  Button,
  Callout,
  Flex,
  TextField,
  Box,
  Text,
  Spinner,
} from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { DeleteProfile } from "@/app/actions/delete-profile";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = confirmText === "Delete my account" && password.length > 0;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("Please enter the confirmation text and password");
      return;
    }

    setError("");
    setIsDeleting(true);

    const formData = new FormData();
    formData.append("password", password);

    const result = await DeleteProfile(formData);

    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) {
          setConfirmText("");
          setPassword("");
          setError("");
        }
      }}
    >
      <AlertDialog.Content maxWidth="450px" className="min-w-80">
        <AlertDialog.Title>Delete Account</AlertDialog.Title>
        <Box my="3">
          <Callout.Root color="red" size="1">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>
              All your profile data and assignments will be permanently deleted.
            </Callout.Text>
          </Callout.Root>
        </Box>

        <form onSubmit={handleDelete}>
          <Flex direction="column" gap="3" my="4">
            <Box>
              <Text
                as="label"
                htmlFor="confirm-text"
                size="2"
                weight="medium"
                mb="2"
                style={{ display: "block" }}
              >
                Type "<strong>Delete my account</strong>"
              </Text>
              <TextField.Root
                id="confirm-text"
                size="2"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setError("");
                }}
                placeholder="Delete my account"
                aria-label="Confirmation text"
                aria-required="true"
              />
            </Box>
            <Box>
              <Text
                as="label"
                htmlFor="password"
                size="2"
                weight="medium"
                mb="2"
                style={{ display: "block" }}
              >
                Password
              </Text>

              <TextField.Root
                id="password"
                type="password"
                size="2"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                aria-label="Password"
                aria-required="true"
              />
            </Box>

            <Box
              role={error ? "alert" : undefined}
              aria-live="polite"
              style={{
                overflow: "hidden",
                maxHeight: error ? "120px" : "0px",
                opacity: error ? 1 : 0,
                transition: "max-height 180ms ease, opacity 180ms ease",
              }}
            >
              {error && (
                <Callout.Root color="red" size="1" mt="2">
                  <Callout.Text>{error}</Callout.Text>
                </Callout.Root>
              )}
            </Box>
          </Flex>

          <Flex gap="3" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray" disabled={isDeleting}>
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <Button
              variant="solid"
              color="red"
              type="submit"
              disabled={!isValid || isDeleting}
            >
              {isDeleting && <Spinner size="2" />}
              Delete Account
            </Button>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
