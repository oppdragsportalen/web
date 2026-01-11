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
import { login } from "@/app/actions/login";
import { useState } from "react";
import Link from "next/link";

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
    <Flex justify="center" align="center" py="9" px="4">
      <Box width="100%" maxWidth="450px">
        <Card size="3">
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="4">
              <Heading size="6" mb="2">
                Log In
              </Heading>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  Email
                </Text>
                <TextField.Root
                  type="email"
                  name="email"
                  id="email"
                  size="3"
                  required
                />
              </Box>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  Password
                </Text>
                <TextField.Root
                  type="password"
                  name="password"
                  id="password"
                  size="3"
                  required
                />
              </Box>

              <Box
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: error ? "200px" : "0px",
                }}
              >
                {error && (
                  <Callout.Root color="red" size="1">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}
              </Box>

              <Button
                type="submit"
                variant="solid"
                color="green"
                mt="2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

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
  );
}
