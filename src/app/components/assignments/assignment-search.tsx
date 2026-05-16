"use client";

import { Box } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function AssignmentSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const normalizedQuery = query.trim();
    const currentQuery = searchParams.get("q") || "";

    if (currentQuery === normalizedQuery) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (normalizedQuery) {
      params.set("q", normalizedQuery);
    } else {
      params.delete("q");
    }

    const nextQueryString = params.toString();
    router.replace(nextQueryString ? `?${nextQueryString}` : "?", {
      scroll: false,
    });
  }, [query, router, searchParams]);

  return (
    <Box
      className="bg-(--color-background) z-10 sticky py-4 top-0 -ml-16 pl-16 -mr-4 pr-4"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
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
      <InputGroup>
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for assignments"
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
    </Box>
  );
}
