import { Card, Box, Flex, Skeleton } from "@radix-ui/themes";

export function AssignmentCardSkeleton() {
  return (
    <Card className="mb-3 p-3">
      <Flex justify="between" align="center" className="mb-2">
        <Skeleton>
          <Box width="200px" height="20px" />
        </Skeleton>
        <Flex gap="2">
          <Skeleton>
            <Box width="60px" height="20px" />
          </Skeleton>
          <Skeleton>
            <Box width="60px" height="20px" />
          </Skeleton>
        </Flex>
      </Flex>
      <Box>
        <Skeleton>
          <Box width="100%" height="40px" />
        </Skeleton>
      </Box>
      <Flex justify="between" align="center" className="mt-2">
        <Skeleton>
          <Box width="100px" height="16px" />
        </Skeleton>
      </Flex>
    </Card>
  );
}
