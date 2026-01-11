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
import { signUp } from "@/app/actions/signup";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);
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
                Create Account
              </Heading>

              <Box>
                <Text as="div" size="2" mb="1" weight="bold">
                  Full Name
                </Text>
                <TextField.Root
                  name="displayName"
                  id="displayName"
                  size="3"
                  required
                />
              </Box>

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
                style={{
                  maxHeight: error ? "200px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-in-out",
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

              <Flex gap="3" mt="2">
                <Button
                  type="button"
                  variant="outline"
                  color="gray"
                  className="flex-1"
                  onClick={() => window.history.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="solid"
                  color="green"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </Flex>

              <Text size="2" color="gray" mt="2">
                Already have an account?{" "}
                <RadixLink asChild color="green">
                  <Link href="/login">Log in</Link>
                </RadixLink>
              </Text>
            </Flex>
          </form>
        </Card>
      </Box>
    </Flex>
  );
}
