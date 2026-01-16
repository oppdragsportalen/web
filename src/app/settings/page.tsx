import {
  Card,
  Box,
  Flex,
  Separator,
  Button,
  Heading,
  AlertDialog,
} from "@radix-ui/themes";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/login";
import { EditProfileDialog } from "../components/edit-profile-dialog";
import AccountInformationDataList from "../components/account-information-data-list";

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
    <Box className="max-w-5xl m-auto">
      <Box p="4">
        <Heading size="6" mb="6">
          Settings
        </Heading>

        <Card size="3">
          <Flex direction="column" gap="5">
            <AccountInformationDataList user={user} profile={profile} />

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
                    Are you sure you want to log out? You'll need to sign in
                    again to access your account.
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
    </Box>
  );
}
