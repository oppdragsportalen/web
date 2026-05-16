import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import { Flex, Text, Button, Box, Separator } from "@radix-ui/themes";
import { logout } from "@/app/actions/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings, LogOut, LayoutGrid } from "lucide-react";

export async function Navbar() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, username, avatar_url")
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
          <Flex gap="2" align="center" className="min-w-44">
            <Box>
              <Text size="3" weight="bold">
                Oppdragsportalen
              </Text>
            </Box>
          </Flex>
        </Link>

        {user && displayName && (
          <Flex gap="4" align="center">
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url}
                      alt={profile?.username}
                    />
                    <AvatarFallback>
                      {profile?.display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm text-sidebar-accent-foreground">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={profile?.avatar_url || undefined}
                          alt={displayName}
                        />
                        <AvatarFallback>
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {profile?.display_name}
                        </span>
                        <span className="truncate text-xs">
                          {profile?.username}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/dashboard/">
                      <DropdownMenuItem>
                        <LayoutGrid />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard/settings">
                      <DropdownMenuItem>
                        <Settings />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem variant="destructive">
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You&apos;ll need to sign
                    in again to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <form action={logout}>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" type="submit">
                      Log out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
          </Flex>
        )}
      </Flex>
    </nav>
  );
}
