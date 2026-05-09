"use client";

import Link from "next/link";
import { Box, Flex, Text } from "@radix-ui/themes";

export function Footer() {
  return (
    <footer className="shrink-0 w-full overflow-scroll mt-auto">
      <Flex
        justify="center"
        align="baseline"
        wrap="nowrap"
        minWidth="440px"
        className="h-12 gap-4 px-4 py-3 overflow-y-hidden overflow-x-scroll min-w-full  "
      >
        <Text size="1" color="gray" className="whitespace-nowrap">
          © {new Date().getFullYear()} Oppdragsportalen
        </Text>

        <Flex gap="4" align="baseline" wrap="nowrap">
          {/* <Text asChild size="1" color="gray">
            <Link href="/faq" className="hover:underline no-underline">
              FAQ
            </Link>
          </Text> */}

          <Text asChild size="1" color="gray">
            <Link href="/terms" className="hover:underline no-underline">
              Terms of Service
            </Link>
          </Text>

          <Text asChild size="1" color="gray">
            <Link href="/privacy" className="hover:underline no-underline">
              Privacy Policy
            </Link>
          </Text>
        </Flex>
      </Flex>
    </footer>
  );
}
