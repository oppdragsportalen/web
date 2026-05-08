"use client";

import {
  Card,
  Box,
  Flex,
  Text,
  Separator,
  Button,
  Heading,
  Callout,
  Link as RadixLink,
} from "@radix-ui/themes";
import { InfoCircledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { auth } from "@/app/actions/auth/auth";
import { useState } from "react";
import Link from "next/link";
import LightRays from "@/app/components/light-rays";

export default function SignUpPage() {
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
    <Flex
      data-hide-navbar-border="true"
      justify="center"
      align="center"
      py="9"
      px="4"
      className="min-w-80"
    >
      <Box className="invisible dark:visible fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#30a4ff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="w-full h-full custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </Box>
      <Box width="100%" maxWidth="450px">
        <Card size="3">
          <Flex direction="column" gap="4">
            <Heading size="6" mb="2" as="h1">
              Create Account
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
              Already have an account?{" "}
              <RadixLink asChild color="green">
                <Link href="/login">Log in</Link>
              </RadixLink>
            </Text>
          </Flex>

          <Separator size="4" my="4" />

          <Box>
            <Flex gap="2" align="start">
              <Text as="label" size="1" htmlFor="terms" color="gray">
                By creating an account, you agree to the{" "}
                <RadixLink asChild color="blue">
                  <Link href="/terms" target="_blank" rel="noopener noreferrer">
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
              </Text>
            </Flex>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
}
