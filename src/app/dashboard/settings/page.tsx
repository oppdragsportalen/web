"use client";

import { Box, Flex, Skeleton } from "@radix-ui/themes";
import { logout } from "@/app/actions/auth/auth";
import { EditProfileDialog } from "@/app/components/profile/edit-profile-dialog";
import { DeleteAccountDialog } from "@/app/components/profile/delete-account-dialog";
import AccountInformationDataList from "@/app/components/profile/account-information-data-list";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
import { Footer } from "@/app/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassphraseConfirm, setShowPassphraseConfirm] = useState(false);

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
      <Box p="4" className="min-w-xs">
        <Flex className="mt-4 mb-10" gap="4">
          <h1 className="text-3xl font-bold max-sm:text-xl">Settings</h1>
        </Flex>

        <Skeleton>
          <Card>
            <CardContent>
              <Box style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Skeleton>
      </Box>
    );
  }

  return (
    <Box p="4" className="min-w-xs">
      <Flex className="mt-4 mb-10" gap="4">
        <h1 className="text-3xl font-bold max-sm:text-xl">Settings</h1>
      </Flex>

      <Card>
        <CardContent>
          <Flex direction="column" gap="5">
            <AccountInformationDataList user={user} profile={profile} />

            <EditProfileDialog
              displayName={profile.display_name}
              username={profile.username ?? ""}
              email={user.email ?? ""}
              loadData={loadData}
            />
          </Flex>
        </CardContent>

        <CardFooter>
          <Flex direction="row" gap="1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:text-destructive-foreground"
                >
                  Log out
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="min-w-80">
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You&apos;ll need to sign
                    in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <form action={logout}>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="secondary">Cancel</Button>
                    </AlertDialogCancel>
                    <Button type="submit" variant="destructive">
                      Log out
                    </Button>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="min-w-80" size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <TriangleAlert />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your account? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel asChild>
                    <Button variant="secondary">Cancel</Button>
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setShowPassphraseConfirm(true);
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DeleteAccountDialog
              open={showPassphraseConfirm}
              onOpenChange={setShowPassphraseConfirm}
            />
          </Flex>
        </CardFooter>
      </Card>

      <Footer />
    </Box>
  );
}
