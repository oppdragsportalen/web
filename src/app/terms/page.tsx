import { Box, Card, Heading, Text, Flex } from "@radix-ui/themes";
import { Footer } from "@/app/components/footer";

export default function TermsOfServicePage() {
  return (
    <Box className="max-w-5xl m-auto min-h-full min-w-80">
      <Flex justify="center" py="9" px="4">
        <Box width="100%" maxWidth="800px">
          <Card size="3">
            <Heading size="8" mb="4">
              Terms of Service
            </Heading>

            <Text as="div" size="2" color="gray" mb="6">
              Last updated: May 9, 2026
            </Text>

            <Box mb="6">
              <Heading size="5" mb="3">
                1. Service Description and Acceptance
              </Heading>
              <Text as="p" size="3" mb="3">
                Oppdragsportalen is an assignment management platform that
                enables users to create and manage tasks and assignments. Users
                can create public assignments visible to all platform users or
                private assignments accessible only to specified individuals.
                The platform also includes direct messaging functionality for
                communication between users.
              </Text>
              <Text as="p" size="3" mb="3">
                By creating an account and using Oppdragsportalen, you accept
                and agree to be bound by these Terms of Service. If you do not
                agree, you must not use the platform.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                2. Permitted Use
              </Heading>
              <Text as="p" size="3" mb="3">
                You are granted a personal, non-transferable license to use
                Oppdragsportalen for managing assignments and tasks. This
                includes:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Creating and managing your own assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Viewing public assignments created by others
                </Text>
                <Text as="div" size="3" mb="2">
                  • Accepting or declining assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Managing access to your private assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Updating assignment status
                </Text>
                <Text as="div" size="3" mb="2">
                  • Sending and receiving direct messages with other users
                </Text>
              </Box>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                3. User Accounts and Responsibilities
              </Heading>
              <Text as="p" size="3" mb="3">
                To use Oppdragsportalen, you must create an account using your
                GitHub account via OAuth authentication. You agree to:
              </Text>
              {/* <Text as="p" size="3" mb="3">
                To use Oppdragsportalen, you must create an account with a valid
                email address and name. You agree to:
              </Text> */}
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Provide accurate GitHub profile information
                </Text>
                <Text as="div" size="3" mb="2">
                  • Keep your GitHub account secure and confidential
                </Text>
                <Text as="div" size="3" mb="2">
                  • Be responsible for all activities under your account
                </Text>
                <Text as="div" size="3" mb="2">
                  • Notify us immediately of any unauthorized access
                </Text>
              </Box>
              {/* <Text as="p" size="3" mb="3">
                You agree to:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Provide accurate and current information
                </Text>
                <Text as="div" size="3" mb="2">
                  • Keep your password secure and confidential
                </Text>
                <Text as="div" size="3" mb="2">
                  • Be responsible for all activities under your account
                </Text>
                <Text as="div" size="3" mb="2">
                  • Notify us immediately of any unauthorized access
                </Text>
              </Box> */}
              <Text as="p" size="3" mb="3">
                You may not share your account credentials or allow others to
                use your account. Accounts are personal and non-transferable.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                4. Assignment Content and Prohibited Uses
              </Heading>
              <Text as="p" size="3" mb="3">
                You are responsible for all assignment content you create. You
                must not create assignments that:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Contain illegal, harmful, or fraudulent content
                </Text>
                <Text as="div" size="3" mb="2">
                  • Violate intellectual property rights of others
                </Text>
                <Text as="div" size="3" mb="2">
                  • Include spam, scams, or misleading information
                </Text>
                <Text as="div" size="3" mb="2">
                  • Promote harassment, discrimination, or hate speech
                </Text>
                <Text as="div" size="3" mb="2">
                  • Contain malicious code or links to harmful websites
                </Text>
                <Text as="div" size="3" mb="2">
                  • Solicit personal information inappropriately
                </Text>
              </Box>
              <Text as="p" size="3" mb="3">
                You are responsible for all messages you send. Messages stored
                in our database are not encrypted and should not contain
                sensitive personal information or passwords. You agree not to
                use messaging to harass, threaten, or spam other users.
              </Text>
              <Text as="p" size="3" mb="3">
                You also agree not to:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Attempt to access other users' private assignments without
                  authorization
                </Text>
                <Text as="div" size="3" mb="2">
                  • Scrape or automate access to the platform
                </Text>
                <Text as="div" size="3" mb="2">
                  • Interfere with the platform's security or functionality
                </Text>
                <Text as="div" size="3" mb="2">
                  • Impersonate others or create fake accounts
                </Text>
                <Text as="div" size="3" mb="2">
                  • Send unsolicited commercial or spam messages
                </Text>
              </Box>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                5. Assignment Ownership and License
              </Heading>
              <Text as="p" size="3" mb="3">
                You retain ownership of all assignments you create. However, by
                creating a public assignment, you grant other users a
                non-exclusive license to view and interact with that assignment
                content.
              </Text>
              <Text as="p" size="3" mb="3">
                For private assignments, access is limited to you and users you
                explicitly authorize. We do not claim ownership of your
                assignment content.
              </Text>
              <Text as="p" size="3" mb="3">
                You are solely responsible for the content of your assignments
                and must ensure you have the right to share any information
                included.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                6. Platform Intellectual Property
              </Heading>
              <Text as="p" size="3" mb="3">
                The platform, including its code, design, features, and
                functionality, is owned by Oppdragsportalen and protected by
                copyright and other intellectual property laws. You may not
                copy, modify, distribute, or reverse engineer any part of the
                platform.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                7. Platform Availability and Support
              </Heading>
              <Text as="p" size="3" mb="3">
                We strive to keep Oppdragsportalen available and functional, but
                we do not guarantee uninterrupted service. The platform may be
                temporarily unavailable due to maintenance, updates, or
                technical issues.
              </Text>
              <Text as="p" size="3" mb="3">
                We are not responsible for:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Disputes between users regarding assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Completion or quality of work on assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Accuracy of assignment information provided by users
                </Text>
                <Text as="div" size="3" mb="2">
                  • Data loss due to user error or technical failures
                </Text>
              </Box>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                8. Termination
              </Heading>
              <Text as="p" size="3" mb="3">
                We reserve the right to suspend or terminate your account if
                you:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Violate these Terms of Service
                </Text>
                <Text as="div" size="3" mb="2">
                  • Create inappropriate or harmful assignment content
                </Text>
                <Text as="div" size="3" mb="2">
                  • Abuse the platform or other users
                </Text>
                <Text as="div" size="3" mb="2">
                  • Attempt to compromise platform security
                </Text>
              </Box>
              <Text as="p" size="3" mb="3">
                You may delete your account at any time. Upon termination, your
                access to assignments will be revoked and your data will be
                deleted according to our Privacy Policy.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                9. Limitation of Liability
              </Heading>
              <Text as="p" size="3" mb="3">
                Oppdragsportalen is provided "as is" without warranties of any
                kind. To the fullest extent permitted by law, we disclaim all
                liability for:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Indirect, incidental, or consequential damages
                </Text>
                <Text as="div" size="3" mb="2">
                  • Loss of data, profits, or business opportunities
                </Text>
                <Text as="div" size="3" mb="2">
                  • Disputes arising from assignment arrangements between users
                </Text>
                <Text as="div" size="3" mb="2">
                  • Content created or shared by other users
                </Text>
                <Text as="div" size="3" mb="2">
                  • Unauthorized access to your account despite our security
                  measures
                </Text>
              </Box>
              <Text as="p" size="3" mb="3">
                Our total liability for any claim related to the platform shall
                be zero, and you shall not be entitled to receive any damages,
                compensation, or payment of any kind.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                10. Changes to Terms
              </Heading>
              <Text as="p" size="3" mb="3">
                We may update these Terms of Service to reflect changes in our
                platform features, legal requirements, or business practices.
                Continued use of the platform after changes constitutes
                acceptance of the new terms.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                11. Contact Us
              </Heading>
              <Text as="p" size="3" mb="2">
                If you have questions about these Terms of Service or need to
                report a violation, please contact us at:
              </Text>
              <Text as="p" size="3">
                Email: support@oppdragsportalen.vatp.no
              </Text>
            </Box>
          </Card>
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
}
