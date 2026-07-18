"use client";

import {
  Card,
  Box,
  Flex,
  Text,
  Separator,
  Heading,
  Callout,
  Badge,
  Link as RadixLink,
} from "@radix-ui/themes";
import { InfoCircledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { auth } from "@/app/actions/auth/auth";
import { useState } from "react";
import Link from "next/link";
import LightRays from "@/app/components/light-rays";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setIsLoading(true);
    setError("");

    const result = await auth();

    if (result?.error) {
      setIsLoading(false);
      setError(result.error);
      return;
    }

    if (result?.url) {
      setIsLoading(false);
      window.location.href = result.url;
    }
  }

  return (
    <Flex
      data-hide-navbar-border="true"
      justify="center"
      align="center"
      direction="column"
      pb="9"
      px="4"
      className="min-w-80"
    >
      <Box className="invisible dark:visible fixed inset-0 -z-10 w-screen h-dvh overflow-hidden pointer-events-none">
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
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="px-6 pt-24 pb-10 text-center"
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
      <Box className="dark:invisible absolute inset-x-10 top-24 bottom-24 -z-10 bg-linear-to-tr from-blue-500/25 via-orange-500/20 to-emerald-400/40 blur-3xl" />
      <Box width="100%" maxWidth="450px">
        <Card
          size="3"
          className="slide-up shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)]"
        >
          <Flex direction="column" gap="4">
            <Heading size="5" mb="2" as="h1">
              Create Account
            </Heading>

            <Button
              style={{
                backgroundColor: "#111",
                transition: "background-color 0.2s ease",
                cursor: "pointer",
              }}
              size="lg"
              className="p-5!"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Please wait
                </>
              ) : (
                <>
                  <GitHubLogoIcon width={20} height={20} />
                  <Text size="3">Continue with GitHub</Text>
                </>
              )}
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
                .
              </Text>
            </Flex>
          </Box>
        </Card>
      </Box>
    </Flex>
  );
}
