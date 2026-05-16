"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/actions/auth/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { Settings, LogOut } from "lucide-react";

type MobileDashboardNavbarProps = {
  profile: {
    display_name: string;
    avatar_url: string;
    username: string;
  } | null;
};

function MobileDashboardNavbar({ profile }: MobileDashboardNavbarProps) {
  return (
    <div className="hidden max-md:block fixed top-0 z-50 h-12 w-full border-b border-gray-200 bg-(--color-background) dark:border-neutral-800">
      <div className="grid h-full grid-cols-3 items-center px-4">
        <div className="flex justify-start">
          <SidebarTrigger />
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <div className="flex aspect-square h-10 rounded-lg items-center justify-center hover:bg-sidebar-accent">
              <Image
                width={75}
                height={75}
                alt="appicon"
                src="/pencil.png"
                className="scale-125 object-cover"
              />
            </div>
          </Link>
        </div>
        <div className="flex justify-end">
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
                        src={profile?.avatar_url}
                        alt={profile?.username}
                      />
                      <AvatarFallback>
                        {profile?.display_name?.charAt(0).toUpperCase()}
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
                  Are you sure you want to log out? You&apos;ll need to sign in
                  again to access your account.
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
        </div>
      </div>
    </div>
  );
}

export default MobileDashboardNavbar;
