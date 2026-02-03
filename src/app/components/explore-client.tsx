"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@radix-ui/themes";
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
  const [batchIndex, setBatchIndex] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

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
      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          detailsHref={`/dashboard/explore/${a.id}`}
        />
      ))}

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
