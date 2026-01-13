import {
  Card,
  Box,
  Flex,
  TextField,
  Text,
  Separator,
  Button,
  Heading,
  AlertDialog,
  Dialog,
  Link as RadixLink,
} from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/login";
import { EditProfileDialog } from "../components/edit-profile-dialog";

export default async function SettingsPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <Box p="4" maxWidth="800px">
      <Heading size="6" mb="6">
        Settings
      </Heading>

      <Card size="3">
        <Flex direction="column" gap="5">
          <Box>
            <Heading size="4" mb="3">
              Account Information
            </Heading>

            <Flex direction="column" gap="2">
              <Text size="2">
                <Text>Name:</Text>{" "}
                <Text color="gray">{profile.display_name}</Text>
              </Text>

              <Text size="2">
                <Text>Email:</Text> <Text color="gray">{user.email}</Text>
              </Text>
            </Flex>
          </Box>

          <EditProfileDialog
            displayName={profile.display_name}
            email={user.email ?? ""}
          />

          <Separator my="4" size="4" />

          <Box>
            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button variant="outline" color="red" type="submit">
                  Log out
                </Button>
              </AlertDialog.Trigger>

              <AlertDialog.Content maxWidth="450px">
                <AlertDialog.Title>Log out</AlertDialog.Title>
                <AlertDialog.Description size="2">
                  Are you sure you want to log out? You'll need to sign in again
                  to access your account.
                </AlertDialog.Description>

                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </AlertDialog.Cancel>

                  <form action={logout}>
                    <AlertDialog.Action>
                      <Button variant="solid" color="red" type="submit">
                        Log out
                      </Button>
                    </AlertDialog.Action>
                  </form>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Box>
        </Flex>
      </Card>
    </Box>
  );
}
