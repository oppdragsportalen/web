"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { UpdateAssignment } from "@/app/actions/assignments/update-assignment";
import {
  getLocalNowDatetime,
  getLocalMaxDatetime,
  localDatetimeToUTC,
  utcToLocalDatetime,
} from "@/lib/timezone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TriangleAlert, Maximize2, Minimize2, Edit2 } from "lucide-react";
import { RichTextEditor } from "@/app/components/rich-text/rich-text-editor";
type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  visibility: "public" | "restricted";
  assignedUsername?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending && <Spinner />}
      {pending ? "Updating..." : "Update"}
    </Button>
  );
}

export function EditAssignmentDialog({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [isRestricted, setIsRestricted] = useState(
    assignment.visibility === "restricted",
  );
  const [description, setDescription] = useState(assignment.description);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");

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

    const result = await UpdateAssignment(formData);

    if (result.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
    setExpanded(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setError("");
          setExpanded(false);
          setIsRestricted(assignment.visibility === "restricted");
          setDescription(assignment.description);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit2 />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className={`
          transition-all duration-300 ease-in-out
          ${expanded ? "min-w-full min-h-full rounded-none" : "min-w-2xs min-h-125"}
        `}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Assignment</DialogTitle>

            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute top-2 right-10"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <Minimize2 className="h-3! w-3!" />
              ) : (
                <Maximize2 className="h-3! w-3!" />
              )}
            </Button>
          </div>
        </DialogHeader>

        <form action={handleSubmit} aria-label="Edit assignment form">
          <input type="hidden" name="id" value={assignment.id} />

          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input
                id="title"
                name="title"
                required
                defaultValue={assignment.title}
                aria-label="Assignment title"
              />
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <RichTextEditor
                name="description"
                value={description}
                onChange={setDescription}
                placeholder="Describe the assignment..."
                ariaLabel="Assignment description"
              />
            </Field>

            <Field>
              <FieldLabel>Deadline</FieldLabel>
              <Input
                id="deadline"
                type="datetime-local"
                name="deadline"
                required
                defaultValue={utcToLocalDatetime(assignment.deadline)}
                min={getLocalNowDatetime()}
                max={getLocalMaxDatetime()}
                aria-label="Assignment deadline"
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
                defaultValue={assignment.assignedUsername || ""}
                required={isRestricted}
                disabled={!isRestricted}
                tabIndex={isRestricted ? 0 : -1}
                aria-label="Assigned username"
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
