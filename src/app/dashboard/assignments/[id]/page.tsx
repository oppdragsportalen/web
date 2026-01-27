import {
  Card,
  Box,
  Text,
  Button,
  Flex,
  Badge,
  Separator,
  AlertDialog,
} from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TrashIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { DeleteAssignment } from "@/app/actions/delete-assignment";

async function getAssignment(id: string, userId: string) {
  const supabase = await createSupabaseServer();

  const { data: assignment, error } = await supabase
    .from("assignments")
    .select("id, title, description, deadline, visibility, created_at")
    .eq("id", id)
    .eq("creator_id", userId)
    .single();

  return { assignment, error };
}

function getStatusBadge(status?: string) {
  switch (status) {
    case "accepted":
      return <Badge color="blue">Taken</Badge>;
    case "in_progress":
      return <Badge color="amber">In Progress</Badge>;
    case "finished":
      return <Badge color="green">Finished</Badge>;
    default:
      return <Badge color="gray">Not Taken</Badge>;
  }
}

function getVisibilityBadge(visibility?: string) {
  switch (visibility) {
    case "public":
      return <Badge color="cyan">Public</Badge>;
    default:
      return (
        <Badge color="gray" variant="outline">
          Restricted
        </Badge>
      );
  }
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { assignment, error } = await getAssignment(id, user.id);

  if (error || !assignment) {
    redirect("/dashboard/assignments");
  }

  return (
    <div className="p-4 min-w-xl">
      <Box className="mt-4 mb-10">
        <Flex align="center" gap="2" className="mb-6">
          <Link href="/dashboard/assignments">
            <h1 className="text-3xl font-bold text-(--gray-9) hover:underline hover:text-(--color-text)">
              Assignments
            </h1>
          </Link>
          <Text size="4" color="gray">
            /
          </Text>
          <h1 className="text-3xl font-bold text-nowrap">{assignment.title}</h1>
        </Flex>
      </Box>

      <Card>
        <Flex justify="between" align="start" gap="4" mb="5">
          <Box>
            <Text size="5" weight="bold" className="leading-tight">
              {assignment.title}
            </Text>
          </Box>

          <Flex gap="2" wrap="wrap" align="center">
            {getVisibilityBadge(assignment.visibility)}
            {getStatusBadge((assignment as any).status)}
          </Flex>
        </Flex>

        <Box mb="5">
          <Box>
            <Text size="2" weight="medium" color="gray">
              Description
            </Text>
          </Box>
          <Card>
            <Text size="2">{assignment.description}</Text>
          </Card>
        </Box>

        <Box mb="5">
          <Flex gap="4">
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Deadline
                </Text>
              </Box>
              <Card>
                <Text size="2">
                  {new Date(assignment.deadline).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Status
                </Text>
              </Box>
              <Card className="w-full">
                <Text size="2" className="capitalize">
                  {(() => {
                    const status = (assignment as any).status;
                    if (status === "accepted") return "Taken";
                    if (status === "in_progress") return "In Progress";
                    if (status === "finished") return "Finished";
                    return "Not Taken";
                  })()}
                </Text>
              </Card>
            </Box>
            <Box>
              <Box>
                <Text size="2" weight="medium" color="gray">
                  Assignment Type
                </Text>
              </Box>
              <Card className="w-full">
                <Text size="2" className="capitalize">
                  {assignment.visibility}
                </Text>
              </Card>
            </Box>
          </Flex>
        </Box>

        <Separator size="4" />

        <Flex justify="between" align="center" gap="3" wrap="wrap" mt="2">
          <Text size="2" color="gray">
            Created{" "}
            {new Date(assignment.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>

          <Flex gap="3">
            <Button>
              <Pencil1Icon />
              Edit
            </Button>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button color="red">
                  <TrashIcon />
                  Delete
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="700px">
                <AlertDialog.Title>Delete assignment</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  Are you sure you want to delete{" "}
                  <strong> {assignment.title}</strong>? This action is permanent
                  and cannot be undone.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>

                  <form action={DeleteAssignment}>
                    <input type="hidden" name="id" value={assignment.id} />
                    <AlertDialog.Action>
                      <Button variant="solid" color="red" type="submit">
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </form>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Flex>
      </Card>
    </div>
  );
}
