import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Flex,
  Text,
  Button,
  Avatar,
  DropdownMenu,
  Box,
  Separator,
  AlertDialog,
  Tooltip,
  IconButton,
} from "@radix-ui/themes";
import { ExitIcon, GearIcon, PlusIcon } from "@radix-ui/react-icons";
import { logout } from "@/app/actions/login";
import { CreateAssignmentDialog } from "@/app/components/create-assignment-dialog";

export async function Navbar() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const displayName = profile?.display_name ?? user?.email ?? null;

  return (
    <nav>
      <Flex
        justify="between"
        className="navbar h-12 border-b border-gray-200 dark:border-neutral-800 items-center gap-4 px-4 py-3 overflow-y-hidden overflow-x-scroll"
      >
        <Link href="/" className="no-underline mr-16">
          <Box>
            <Text size="3" weight="bold" className="cursor-pointer">
              Oppdragsportalen
            </Text>
          </Box>
        </Link>

        {user && displayName && (
          <Flex gap="4" align="center">
            <CreateAssignmentDialog
              trigger={
                <IconButton aria-label="Create assignment">
                  <PlusIcon />
                </IconButton>
              }
            />

            <Link
              href="/dashboard"
              className="no-underline  flex items-center justify-center"
            >
              <Button variant="ghost" color="gray">
                <Text size="2" weight="medium" className="cursor-pointer">
                  Dashboard
                </Text>
              </Button>
            </Link>

            <Separator orientation="vertical" />

            <AlertDialog.Root>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost">
                    <Flex align="center" gap="2">
                      <Text size="2">{displayName}</Text>
                      <Avatar
                        size="2"
                        alt={displayName}
                        fallback={displayName.charAt(0).toUpperCase()}
                      />
                    </Flex>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item asChild>
                    <Link href="/settings" className="no-underline">
                      <Flex align="center" gap="2">
                        <GearIcon />
                        <Text>Settings</Text>
                      </Flex>
                    </Link>
                  </DropdownMenu.Item>
                  <AlertDialog.Trigger>
                    <DropdownMenu.Item color="red" className="cursor-pointer">
                      <Flex align="center" gap="2">
                        <ExitIcon />
                        Log out
                      </Flex>
                    </DropdownMenu.Item>
                  </AlertDialog.Trigger>
                </DropdownMenu.Content>
              </DropdownMenu.Root>

              <AlertDialog.Content maxWidth="450px" className="min-w-80">
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
          </Flex>
        )}
      </Flex>
    </nav>
  );
}
