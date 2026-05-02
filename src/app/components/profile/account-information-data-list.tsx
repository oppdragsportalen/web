"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  DataList,
  Code,
  Heading,
  IconButton,
  Popover,
  Text,
} from "@radix-ui/themes";
import { CopyIcon } from "@radix-ui/react-icons";

type Props = {
  user: {
    id: string;
    email?: string | null;
  };
  profile: {
    display_name?: string | null;
    username?: string | null;
  };
};

const AccountInformationDataList = ({ user, profile }: Props) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyUserID = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 800);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Box>
      <Heading size="4" mb="3">
        Account Information
      </Heading>

      <DataList.Root>
        <DataList.Item>
          <DataList.Label minWidth="2px">ID</DataList.Label>
          <DataList.Value>
            <Flex align="center" gap="2">
              <Code variant="ghost">{user.id}</Code>
              <Popover.Root open={copied} onOpenChange={setCopied}>
                <Popover.Trigger>
                  <IconButton
                    onClick={copyUserID}
                    size="1"
                    aria-label="Copy value"
                    color="gray"
                    variant="ghost"
                  >
                    <CopyIcon />
                  </IconButton>
                </Popover.Trigger>
                <Popover.Content side="right" align="center">
                  <Text size="1">Copied</Text>
                </Popover.Content>
              </Popover.Root>
            </Flex>
          </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="2px">Name</DataList.Label>
          <DataList.Value>{profile.display_name ?? ""}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="2px">Email</DataList.Label>
          <DataList.Value>{user.email}</DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label minWidth="2px">Username</DataList.Label>
          <DataList.Value>{profile.username}</DataList.Value>
        </DataList.Item>
      </DataList.Root>
    </Box>
  );
};

export default AccountInformationDataList;
