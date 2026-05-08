"use client";

import {
  Card,
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Separator,
  Badge,
  Callout,
  Link as RadixLink,
} from "@radix-ui/themes";
import { InfoCircledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { auth } from "@/app/actions/auth/auth";
import { useState } from "react";
import Link from "next/link";
import LightRays from "../components/light-rays";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    const result = await auth();

    if (result?.error) {
      setError(result.error);
      return;
    }

    if (result?.url) {
      window.location.href = result.url;
    }
  }

  return (
    <Box data-hide-navbar-border="true">
      <Box className="invisible dark:visible fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none">
        <LightRays
          className="w-full h-full custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="slide-up px-6 pt-24 pb-10 text-center"
      >
        <Image
          width={100}
          height={100}
          alt="appicon"
          src="/favicon.ico"
          className="w-16 sm:w-20 md:w-24"
        />
        <Badge
          size="2"
          variant="surface"
          color="gray"
          radius="full"
          className="mt-1"
        >
          Assign. Track. Complete.
        </Badge>
      </Flex>
      <Flex justify="center" align="center" pb="9" px="4" className="min-w-80">
        <Box width="100%" maxWidth="450px" className="slide-up">
          <Card size="3" className="slide-up">
            <Flex direction="column" gap="4">
              <Heading size="5" mb="2" as="h1">
                Log In
              </Heading>

              <Button
                style={{
                  backgroundColor: "#111",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                }}
                size="3"
                onClick={handleSubmit}
              >
                <GitHubLogoIcon width={20} height={20} />
                <Text size="3">Continue with GitHub</Text>
              </Button>

              <Box
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: error ? "200px" : "0px",
                }}
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                {error && (
                  <Callout.Root color="red" size="1" id="error-message">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}
              </Box>

              <Text size="1" mt="-4" mb="4">
                Don't have an account?{" "}
                <RadixLink asChild color="green">
                  <Link href="/signup">Sign up</Link>
                </RadixLink>
              </Text>

              <Separator size="4" />

              <Box>
                <Flex gap="2" align="start">
                  <Text as="label" size="1" htmlFor="terms" color="gray">
                    By continuing, you agree to the{" "}
                    <RadixLink asChild color="blue">
                      <Link
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </Link>
                    </RadixLink>{" "}
                    and{" "}
                    <RadixLink asChild color="blue">
                      <Link
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </Link>
                    </RadixLink>
                    .
                  </Text>
                </Flex>
              </Box>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
