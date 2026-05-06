import React from "react";
import { Skeleton, Box, Card, Text, Flex, IconButton } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

function ChatDetailSkeleton() {
  return (
    <>
      <Box className="flex-col min-h-full relative">
        <Box
          p="4"
          className="sticky top-0 left-0 w-full h-16 z-20"
          style={{
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            background: `
                      linear-gradient(
                        to bottom,
                        rgba(var(--color-background-rgb), 0.95) 0%,
                        rgba(var(--color-background-rgb), 0) 100%
                      )
                    `,
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Flex gap="2">
            <Link href="/dashboard/messages">
              <IconButton variant="soft">
                <ArrowLeftIcon />
              </IconButton>
            </Link>

            <Flex>
              <Flex align="center" gap="2">
                <Skeleton>
                  <Box className="w-30 min-h-5"></Box>
                </Skeleton>
                <Skeleton>
                  <Box className="w-20 min-h-5"></Box>
                </Skeleton>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
      <Flex justify="end" direction="column">
        <Flex justify="end">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-8 w-60 rounded-md" />
                <Flex justify="end" align="end">
                  <Text size="1">
                    <Box className="h-8 w-40 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex justify="start">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-16 w-sm rounded-md" />
                <Flex justify="end" align="end">
                  <Text size="1">
                    <Box className="h-8 w-20 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex className="" justify="start">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-8 w-xl rounded-md" />
                <Flex justify="end" align="start">
                  <Text size="1">
                    <Box className="h-8 w-40 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex className="" justify="end">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-8 w-44 rounded-md" />
                <Flex justify="end" align="start">
                  <Text size="1">
                    <Box className="h-8 w-40 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex className="" justify="end">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-8 w-xl rounded-md" />
                <Flex justify="end" align="start">
                  <Text size="1">
                    <Box className="h-8 w-40 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex className="" justify="start">
          <Flex>
            <Skeleton>
              <Card m="3">
                <Box className="h-8 w-4 rounded-md" />
                <Flex justify="end" align="start">
                  <Text size="1">
                    <Box className="h-8 w-72 rounded-md" />
                  </Text>
                </Flex>
              </Card>
            </Skeleton>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default ChatDetailSkeleton;
