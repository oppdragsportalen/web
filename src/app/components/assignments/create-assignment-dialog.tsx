"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { CreateAssignment } from "@/app/actions/assignments/create-assignment";
import {
  getLocalNowDatetime,
  getLocalDefaultDatetime,
  getLocalMaxDatetime,
  localDatetimeToUTC,
} from "@/lib/timezone";
import { Flex } from "@radix-ui/themes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert, Maximize2, Minimize2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner />}
      {pending ? "Creating..." : "Create"}
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
  const [expanded, setExpanded] = useState(false);

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
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError("");
          setExpanded(false);
          setIsRestricted(false);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className={`
            transition-all duration-300 ease-in-out
            ${expanded ? "min-w-full min-h-full rounded-none" : "min-w-2xs min-h-125"}
          `}
      >
        <DialogHeader>
          <Flex>
            <DialogTitle>Create Assignment</DialogTitle>
            <Button
              variant="ghost"
              className="absolute top-2 right-10"
              size="icon-sm"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <Minimize2 className="h-3! w-3!" />
              ) : (
                <Maximize2 className="h-3! w-3!" />
              )}
            </Button>
          </Flex>
        </DialogHeader>
        <form
          action={handleSubmit}
          style={{ transition: "all 0.2s ease-in-out" }}
          aria-label="Create assignment form"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                id="title"
                name="title"
                required
                aria-required="true"
                aria-label="Assignment title"
              />
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                style={{ maxHeight: "12em", resize: "vertical" }}
                aria-label="Assignment description"
              />
            </Field>
            <Field>
              <FieldLabel>Deadline</FieldLabel>
              <Input
                id="deadline"
                type="datetime-local"
                name="deadline"
                required
                aria-required="true"
                aria-label="Assignment deadline"
                aria-describedby="deadline-hint"
                defaultValue={getLocalDefaultDatetime()}
                min={getLocalNowDatetime()}
                max={getLocalMaxDatetime()}
              />
            </Field>
            <FieldSeparator />
            <Field>
              <FieldLabel>Assignment Type</FieldLabel>
              <Tabs
                value={isRestricted ? "restricted" : "public"}
                onValueChange={(value) =>
                  setIsRestricted(value === "restricted")
                }
              >
                <TabsList>
                  <TabsTrigger value="public">Public</TabsTrigger>
                  <TabsTrigger value="restricted">Restricted</TabsTrigger>
                </TabsList>
              </Tabs>
            </Field>
            <Field
              className={`overflow-hidden transition-all duration-300 ${
                isRestricted ? "max-h-50 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <Label htmlFor="assignedUsername">Assign to user</Label>
              <Input
                id="assignedUsername"
                name="assignedUsername"
                placeholder="Enter username"
                required={isRestricted}
                aria-required={isRestricted}
                aria-label="Assigned username"
                disabled={!isRestricted}
                tabIndex={isRestricted ? 0 : -1}
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
          </FieldGroup>
          <DialogFooter
            className={`
              transition-all duration-300 ease-in-out
              ${expanded ? "bg-transparent" : ""}
            `}
          >
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
