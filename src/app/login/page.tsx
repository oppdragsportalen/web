"use client";

import {
  Card,
  Box,
  Flex,
  Text,
  Button,
  Heading,
  Callout,
  Link as RadixLink,
} from "@radix-ui/themes";
import { InfoCircledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { auth } from "@/app/actions/auth/auth";
import { useState } from "react";
import Link from "next/link";
import LightRays from "../components/light-rays";

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
      <Flex justify="center" align="center" py="9" px="4" className="min-w-80">
        <Box width="100%" maxWidth="450px">
          <Card size="3">
            <Flex direction="column" gap="4">
              <Heading size="6" mb="2" as="h1">
                Log In
              </Heading>

              <Button
                style={{
                  backgroundColor: "#21262d",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#2d323a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#21262d";
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

              <Text size="2" color="gray">
                Don't have an account?{" "}
                <RadixLink asChild color="green">
                  <Link href="/signup">Sign up</Link>
                </RadixLink>
              </Text>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
