"use client";

import {
  Card,
  Box,
  Flex,
  Separator,
  Button,
  Heading,
  AlertDialog,
  Skeleton,
} from "@radix-ui/themes";
import { logout } from "@/app/actions/login";
import { EditProfileDialog } from "../components/edit-profile-dialog";
import { DeleteAccountDialog } from "../components/delete-account-dialog";
import AccountInformationDataList from "../components/account-information-data-list";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Footer } from "@/app/components/footer";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function loadData() {
    const supabase = createSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
      return;
    }

    setUser(user);

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(profile);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!user || !profile) {
    return (
      <Box className="max-w-5xl m-auto" minWidth="400px">
        <Box p="4">
          <Skeleton>
            <Heading size="7" my="5">
              Settings
            </Heading>
          </Skeleton>

          <Skeleton>
            <Card size="3">
              <Box style={{ height: 300 }} />
            </Card>
          </Skeleton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      className="max-w-5xl m-auto min-h-full"
      minWidth="400px"
    >
      <Box p="4" className="flex-1">
        <Heading size="7" my="5">
          Settings
        </Heading>

        <Card size="3">
          <Flex direction="column" gap="5">
            <AccountInformationDataList user={user} profile={profile} />

            <EditProfileDialog
              displayName={profile.display_name}
              email={user.email ?? ""}
              loadData={loadData}
            />

            <Separator my="4" size="4" />

            <Flex direction="row" gap="3">
              <Box>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button variant="outline" color="red" type="submit">
                      Log out
                    </Button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Content maxWidth="450px" className="min-w-80">
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

              <Box>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button variant="solid" color="red">
                      Delete Account
                    </Button>
                  </AlertDialog.Trigger>

                  <AlertDialog.Content maxWidth="450px" className="min-w-80">
                    <AlertDialog.Title>Delete Account</AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button variant="soft" color="gray">
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>

                      <Button
                        variant="solid"
                        color="red"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </Box>
            </Flex>

            <DeleteAccountDialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            />
          </Flex>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}
