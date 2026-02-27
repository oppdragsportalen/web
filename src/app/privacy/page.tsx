import { Box, Card, Heading, Text, Flex } from "@radix-ui/themes";
import Link from "next/link";
import { Footer } from "@/app/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <Box className="max-w-5xl m-auto min-h-full" minWidth="400px">
      <Flex justify="center" py="9" px="4">
        <Box width="100%" maxWidth="800px">
          <Card size="3">
            <Heading size="8" mb="4">
              Privacy Policy
            </Heading>

            <Text as="div" size="2" color="gray" mb="6">
              Last updated: February 27, 2026
            </Text>

            <Box mb="6">
              <Heading size="5" mb="3">
                1. Introduction
              </Heading>
              <Text as="p" size="3" mb="3">
                Oppdragsportalen is an assignment management platform that
                allows users to create, and manage tasks and assignments. This
                Privacy Policy explains how we collect, use, and protect your
                personal information when you use our platform.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                2. Information We Collect
              </Heading>
              <Text as="p" size="3" mb="3">
                <strong>Account Information:</strong> When you create an
                account, we collect your name, email address, and password
                encrypted.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Assignment Data:</strong> We store assignments you
                create, including titles, descriptions, deadlines, and
                visibility settings (public or private). For private
                assignments, we also store the email addresses of users you
                grant access to.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Assignment Claims:</strong> We track which assignments
                you accept, decline, or mark as in-progress or finished.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Usage Data:</strong> We collect information about how
                you interact with the platform, including login times and
                assignment activity.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                3. How We Use Your Information
              </Heading>
              <Text as="p" size="3" mb="3">
                We use your information to:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Enable you to create and manage assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • Display your created assignments to other users (for public
                  assignments)
                </Text>
                <Text as="div" size="3" mb="2">
                  • Restrict access to private assignments to only authorized
                  users
                </Text>
                <Text as="div" size="3" mb="2">
                  • Track assignment status and completion
                </Text>
                <Text as="div" size="3" mb="2">
                  • Authenticate your account and maintain security
                </Text>
                <Text as="div" size="3" mb="2">
                  • Improve platform features and user experience
                </Text>
              </Box>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                4. Information Sharing and Visibility
              </Heading>
              <Text as="p" size="3" mb="3">
                <strong>Public Assignments:</strong> When you create a public
                assignment, the title, description, deadline, and your display
                name as the creator are visible to all registered users of the
                platform.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Private Assignments:</strong> Private assignments are
                only visible to you and users you explicitly grant access to via
                their email addresses.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Email Visibility:</strong> Your email address is visible
                to all users for contact purposes.
              </Text>
              <Text as="p" size="3" mb="3">
                <strong>Third-Party Services:</strong> We use Supabase, a secure
                database and authentication platform, to store and manage all
                user data. Supabase processes data on our behalf under strict
                confidentiality and security agreements. All data stored in
                Supabase is encrypted both at rest and in transit.
              </Text>
              <Text as="p" size="3" mb="3">
                We do not sell, trade, or rent your personal information to any
                third parties. We may disclose your information only if required
                by law or to protect our rights and safety.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                5. Data Security and Encryption
              </Heading>
              <Text as="p" size="3" mb="3">
                We take security seriously and implement industry-standard
                measures to protect all user data:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • <strong>Authentication:</strong> Powered by Supabase Auth
                  with secure password hashing (bcrypt)
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Encryption at Rest:</strong> All data is encrypted
                  in the Supabase database using AES-256 encryption
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Encryption in Transit:</strong> All data
                  transmission uses HTTPS/TLS encryption
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Database Security:</strong> Row-level security
                  policies ensure users can only access their own data and
                  authorized assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Infrastructure:</strong> Hosted on secure, SOC 2
                  Type II compliant infrastructure
                </Text>
              </Box>
              <Text as="p" size="3" mb="3">
                Your password is never stored in plain text - it is securely
                hashed before being saved. Even administrators cannot view your
                password.
              </Text>
              <Text as="p" size="3" mb="3">
                However, no method of transmission over the internet is 100%
                secure. While we strive to protect your data using best
                practices, we cannot guarantee absolute security.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                6. Your Rights and Data Control
              </Heading>
              <Text as="p" size="3" mb="3">
                You have full control over your data:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • <strong>View and Edit:</strong> Update your profile
                  information in account settings
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Delete Assignments:</strong> Remove any assignments
                  you created at any time
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Control Visibility:</strong> Change assignment
                  visibility between public and private
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Manage Access:</strong> Add or remove users from
                  private assignments
                </Text>
                <Text as="div" size="3" mb="2">
                  • <strong>Account Deletion:</strong> Delete your account and
                  all associated data
                </Text>
              </Box>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                7. Cookies and Session Management
              </Heading>
              <Text as="p" size="3" mb="3">
                We use essential cookies to:
              </Text>
              <Box ml="4" mb="3">
                <Text as="div" size="3" mb="2">
                  • Keep you logged in to your account
                </Text>
                <Text as="div" size="3" mb="2">
                  • Maintain your session security
                </Text>
                <Text as="div" size="3" mb="2">
                  • Remember your preferences
                </Text>
              </Box>
              <Text as="p" size="3" mb="3">
                We do not use tracking cookies for advertising purposes.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                8. Data Retention
              </Heading>
              <Text as="p" size="3" mb="3">
                We retain your account and assignment data for as long as your
                account is active. When you delete an assignment, it is
                permanently removed from our database. If you delete your
                account, all your data will be permanently deleted within 30
                days.
              </Text>
            </Box>

            <Box mb="6">
              <Heading size="5" mb="3">
                9. Changes to This Policy
              </Heading>
              <Text as="p" size="3" mb="3">
                We may update this Privacy Policy to reflect changes in our
                practices or for legal reasons. We will notify users of
                significant changes by posting a notice on the platform and
                updating the "Last updated" date. Your continued use of the
                platform after changes constitutes acceptance.
              </Text>
            </Box>

            {/* <Box mb="6">
            <Heading size="5" mb="3">
              10. Contact Us
            </Heading>
            <Text as="p" size="3">
              If you have questions about this Privacy Policy or wish to
              exercise your data rights, please contact us at:
            </Text>
            <Text as="p" size="3" mb="2">
              Email: privacy@oppdragsportalen.no
            </Text>
          </Box> */}
          </Card>
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
}
