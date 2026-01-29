import { Box, Card, Flex, Heading, Text, Separator } from "@radix-ui/themes";
import Link from "next/link";
import { Footer } from "@/app/components/footer";

const FAQ_ITEMS = [
  {
    q: "What is Oppdragsportalen?",
    a: "Oppdragsportalen is an assignment management platform where users can create assignments and manage access to them.",
  },
  {
    q: "What's the difference between Public and Restricted assignments?",
    a: "Public assignments are visible to all authenticated users. Restricted assignments are only visible to the creator and the user added by the creator.",
  },
  {
    q: "How do I restrict an assignment to a specific user?",
    a: 'When creating or editing an assignment, select "Restricted" and enter the user\'s email address. The system links access to that user account.',
  },
  {
    q: "Can I change an assignment from Restricted to Public?",
    a: "Yes. Edit the assignment and switch the visibility. If you set it to Public, any allow-list entry is removed.",
  },
  {
    q: "Where can I manage my profile?",
    a: "Go to Settings to update your profile information.",
  },
  {
    q: "How do I delete my account?",
    a: "In Settings you can delete your account. This permanently deletes your profile and your data.",
  },
] as const;

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <Box mb="5">
      <Heading size="4" mb="2">
        {q}
      </Heading>
      <Text as="p" size="3" color="gray">
        {a}
      </Text>
    </Box>
  );
}

export default function FaqPage() {
  return (
    <Box className="max-w-5xl m-auto min-h-full" minWidth="400px">
      <Flex justify="center" py="9" px="4">
        <Box width="100%" maxWidth="800px">
          <Card size="3">
            <Heading size="8" mb="4">
              FAQ
            </Heading>

            <Box mb="6">
              {FAQ_ITEMS.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </Box>

            <Separator size="4" my="4" />

            <Text as="p" size="2" color="gray" weight="medium">
              Looking for legal info? See{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </Text>
          </Card>
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
}
