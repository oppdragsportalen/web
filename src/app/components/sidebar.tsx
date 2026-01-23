"use client";

import { Box, Flex, Text, Inset } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearIcon, HomeIcon, FileTextIcon } from "@radix-ui/react-icons";


const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/dashboard/assignments", label: "Assignments", icon: FileTextIcon },
  { href: "/settings", label: "Settings", icon: GearIcon },
];

export function Sidebar() {
  return (
    <Box className="w-auto border-r border-gray-200 dark:border-neutral-800 h-screen overflow-scroll">
      <Flex direction="column" gap="1" p="2">
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={usePathname() === item.href}
          />
        ))}
      </Flex>
    </Box>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: any;
  isActive: boolean;
}) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Flex
        align="center"
        gap="3"
        px="3"
        py="2"
        className={`rounded-md w-44 transition-colors ${
          isActive
            ? "bg-(--accent-a3) text-(--accent-11)"
            : "hover:bg-(--gray-a3) text-(--gray-11)"
        }`}
      >
        <Icon width="18" height="18" />
        <Text size="2" weight={isActive ? "bold" : "regular"}>
          {label}
        </Text>
      </Flex>
    </Link>
  );
}
