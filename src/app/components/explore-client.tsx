"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text, TextField } from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { AssignmentCard } from "@/app/components/assignment-card";
import { AssignmentCardSkeleton } from "@/app/components/assignment-card-skeleton";
import { GetAvailableAssignments } from "@/app/actions/get-available-assignments";

type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  visibility: string;
  created_at: string;
};

type ExploreClientProps = {
  initialAssignments: Assignment[];
  initialHasMore: boolean;
};

function appendUniqueAssignments(
  prev: Assignment[],
  next: Assignment[],
): Assignment[] {
  if (next.length === 0) return prev;
  const existingIds = new Set(prev.map((a) => a.id));
  const uniqueNext = next.filter((a) => !existingIds.has(a.id));
  return uniqueNext.length ? [...prev, ...uniqueNext] : prev;
}

export default function ExploreClient({
  initialAssignments,
  initialHasMore,
}: ExploreClientProps) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [query, setQuery] = useState("");
  const [batchIndex, setBatchIndex] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredAssignments = normalizedQuery
    ? assignments.filter((a) =>
        `${a.title} ${a.description}`.toLowerCase().includes(normalizedQuery),
      )
    : assignments;

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { assignments: newAssignments, hasMore: moreAvailable } =
        await GetAvailableAssignments(batchIndex);

      setAssignments((prev) =>
        appendUniqueAssignments(prev, newAssignments ?? []),
      );
      setHasMore(moreAvailable);
      setBatchIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, batchIndex]);

  if (assignments.length === 0 && !isLoading) {
    return (
      <Text size="2" color="gray">
        No available assignments yet. Check back later or create your own.
      </Text>
    );
  }

  return (
    <Box>
      <Box
        className="bg-(--color-background) z-10 sticky py-4 top-0 -mx-4 px-4"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: `
            linear-gradient(
              to bottom,
              rgba(var(--color-background-rgb), 0.95) 0%,
              rgba(var(--color-background-rgb), 0.75) 45%,
              rgba(var(--color-background-rgb), 0.25) 75%,
              rgba(var(--color-background-rgb), 0) 100%
            )
          `,
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Box>
          <TextField.Root
            id="explore-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for assignments"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
        </Box>
      </Box>

      {filteredAssignments.length === 0 && !isLoading ? (
        <Text size="2" color="gray">
          No assignments match your search.
        </Text>
      ) : (
        filteredAssignments.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            detailsHref={`/dashboard/explore/${a.id}`}
          />
        ))
      )}

      {isLoading && (
        <>
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
          <AssignmentCardSkeleton />
        </>
      )}

      <div ref={loaderRef} style={{ height: "20px" }} />
    </Box>
  );
}
