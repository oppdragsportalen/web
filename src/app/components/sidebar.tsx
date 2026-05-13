"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/actions/auth/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  ChevronsUpDown,
  ShieldCheck,
  LogOut,
  FileText,
  Settings,
  LayoutGrid,
  Search,
  MessageCircle,
} from "lucide-react";

import { Text, Box } from "@radix-ui/themes";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/explore", label: "Explore", icon: Search },
  { href: "/dashboard/messages", label: "Messages", icon: MessageCircle },
  {
    href: "/dashboard/assignments",
    label: "My Assignments",
    icon: FileText,
  },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

type AppSidebarProps = {
  profile: {
    display_name: string;
    avatar_url: string;
    username: string;
  } | null;
};

export function AppSidebar({ profile }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <Link href="/">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    width={100}
                    height={100}
                    alt="appicon"
                    src="/pencil.png"
                    className="w-16 sm:w-20 md:w-24 rounded-sm"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <Text size="3" weight="bold">
                    Oppdragsportalen
                  </Text>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <Box className="-ml-0.5">
          <SidebarTrigger />
        </Box>
        <SidebarMenu>
          <SidebarMenuItem>
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url}
                        alt={profile?.username}
                      />
                      <AvatarFallback>
                        {profile?.display_name.charAt(0).toUpperCase()}
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
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm text-sidebar-accent-foreground">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={profile?.avatar_url}
                          alt={profile?.username}
                        />
                        <AvatarFallback className="rounded-lg">
                          {profile?.display_name.charAt(0).toUpperCase()}
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
                    <Link href="/dashboard/settings">
                      <DropdownMenuItem>
                        <Settings />
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link href="/terms">
                      <DropdownMenuItem>
                        <FileText />
                        Terms of Service
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/privacy">
                      <DropdownMenuItem>
                        <ShieldCheck />
                        Privacy Policy
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
