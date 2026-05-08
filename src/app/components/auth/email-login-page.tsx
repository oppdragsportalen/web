"use client";

import {
  Card,
  Box,
  Flex,
  Text,
  TextField,
  Button,
  Heading,
  Callout,
  Link as RadixLink,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { login } from "@/app/actions/auth/email-login";  
import { useState } from "react";
import Link from "next/link";
import LightRays from "@/app/components/light-rays";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
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
            <form onSubmit={handleSubmit} aria-label="Log in form">
              <Flex direction="column" gap="4">
                <Heading size="6" mb="2" as="h1">
                  Log In
                </Heading>

                <Box>
                  <Text
                    as="label"
                    size="2"
                    mb="1"
                    weight="bold"
                    htmlFor="email"
                  >
                    Email
                  </Text>
                  <TextField.Root
                    type="email"
                    name="email"
                    id="email"
                    size="3"
                    required
                    aria-required="true"
                    aria-label="Email address"
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </Box>

                <Box>
                  <Text
                    as="label"
                    size="2"
                    mb="1"
                    weight="bold"
                    htmlFor="password"
                  >
                    Password
                  </Text>
                  <TextField.Root
                    type="password"
                    name="password"
                    id="password"
                    size="3"
                    required
                    aria-required="true"
                    aria-label="Password"
                    aria-describedby={error ? "error-message" : undefined}
                  />
                </Box>

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

                <Flex gap="3" mt="2">
                  <Button
                    type="button"
                    variant="outline"
                    color="gray"
                    className="flex-1"
                    onClick={() => window.history.back()}
                    disabled={loading}
                    aria-label="Cancel account creation"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    color="green"
                    disabled={loading}
                    aria-label={loading ? "Logging in, please wait" : "Log in"}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </Flex>

                <Text size="2" color="gray" mt="2">
                  Don't have an account?{" "}
                  <RadixLink asChild color="green">
                    <Link href="/signup">Sign up</Link>
                  </RadixLink>
                </Text>
              </Flex>
            </form>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
}
