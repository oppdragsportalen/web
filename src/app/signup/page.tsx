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
  Checkbox,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { signUp } from "@/app/actions/signup";
import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!acceptedTerms) {
      setError(
        "You must accept the Terms of Service and Privacy Policy to sign up.",
      );
      return;
    }

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
    <Flex justify="center" align="center" py="9" px="4" className="min-w-80">
      <Box width="100%" maxWidth="450px">
        <Card size="3">
          <form onSubmit={handleSubmit} aria-label="Create account form">
            <Flex direction="column" gap="4">
              <Heading size="6" mb="2" as="h1">
                Create Account
              </Heading>

              <Box>
                <Text
                  as="label"
                  size="2"
                  mb="1"
                  weight="bold"
                  htmlFor="displayName"
                >
                  Full Name
                </Text>
                <TextField.Root
                  name="displayName"
                  id="displayName"
                  size="3"
                  required
                  aria-required="true"
                  aria-label="Full Name"
                />
              </Box>

              <Box>
                <Text as="label" size="2" mb="1" weight="bold" htmlFor="email">
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
                  aria-describedby="password-hint"
                />
              </Box>

              <Box>
                <Flex gap="2" align="start">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) =>
                      setAcceptedTerms(checked === true)
                    }
                    aria-required="true"
                    aria-label="Accept terms and privacy policy"
                  />
                  <Text as="label" size="1" htmlFor="terms">
                    I accept the{" "}
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
                  </Text>
                </Flex>
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
                  className="flex-1"
                  disabled={loading || !acceptedTerms}
                  aria-label={
                    loading
                      ? "Creating account, please wait"
                      : "Sign up for account"
                  }
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
