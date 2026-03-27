import { Card, Box, Flex, Skeleton, Text, Separator } from "@radix-ui/themes";

export default function AssignmentSkeleton() {
  return (
    <Box>
      <Box className="mt-4 mb-10">
        <Flex align="center" gap="2" className="mb-6">
          <Skeleton>
            <Box className="h-8 w-40 rounded-md" />
          </Skeleton>

          <Text size="4" color="gray">
            /
          </Text>

          <Skeleton>
            <Box className="h-8 w-64 rounded-md" />
          </Skeleton>
        </Flex>
      </Box>

      <Card>
        <Flex justify="between" align="start" gap="4" mb="5">
          <Skeleton>
            <Box className="h-6 w-72 rounded-md" />
          </Skeleton>

          <Flex gap="2">
            <Skeleton>
              <Box className="h-5 w-20 rounded-full" />
            </Skeleton>
            <Skeleton>
              <Box className="h-5 w-24 rounded-full" />
            </Skeleton>
          </Flex>
        </Flex>

        <Box mb="5">
          <Skeleton>
            <Box className="h-4 w-28 mb-2 rounded-md" />
          </Skeleton>

          <Card>
            <Skeleton>
              <Box className="h-16 w-full rounded-md" />
            </Skeleton>
          </Card>
        </Box>

        <Box mb="5">
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i}>
                <Skeleton>
                  <Box className="h-4 w-24 mb-2 rounded-md" />
                </Skeleton>
                <Card>
                  <Skeleton>
                    <Box className="h-4 w-28 rounded-md" />
                  </Skeleton>
                </Card>
              </Box>
            ))}
          </div>
        </Box>

        <Separator size="4" />

        <Flex justify="between" align="center" mt="2">
          <Skeleton>
            <Box className="h-4 w-32 rounded-md" />
          </Skeleton>

          <Skeleton>
            <Box className="h-9 w-32 rounded-md" />
          </Skeleton>
        </Flex>
      </Card>
    </Box>
  );
}
