"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
} from "@/components/ui/sidebar";

import {
  DashboardIcon,
  MagnifyingGlassIcon,
  ChatBubbleIcon,
  FileTextIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { Text } from "@radix-ui/themes";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/dashboard/explore", label: "Explore", icon: MagnifyingGlassIcon },
  { href: "/dashboard/messages", label: "Messages", icon: ChatBubbleIcon },
  {
    href: "/dashboard/assignments",
    label: "My Assignments",
    icon: FileTextIcon,
  },
  { href: "/dashboard/settings", label: "Settings", icon: GearIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

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
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
