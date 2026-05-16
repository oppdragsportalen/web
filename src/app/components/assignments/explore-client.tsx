"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Text } from "@radix-ui/themes";
import { AssignmentCard } from "@/app/components/assignments/assignment-card";
import { AssignmentCardSkeleton } from "@/app/components/assignments/assignment-card-skeleton";
import { GetAvailableAssignments } from "@/app/actions/assignments/get-available-assignments";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

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
  fetchAction?: typeof GetAvailableAssignments;
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
  fetchAction = GetAvailableAssignments,
}: ExploreClientProps) {
  const [assignments, setAssignments] =
    useState<Assignment[]>(initialAssignments);
  const [query, setQuery] = useState("");
  const [batchIndex, setBatchIndex] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { assignments: newAssignments, hasMore: moreAvailable } =
        await fetchAction(batchIndex, query.trim());

      setAssignments((prev) => appendUniqueAssignments(prev, newAssignments));
      setHasMore(moreAvailable);
      setBatchIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (!query.trim()) return;
    }

    let isActive = true;

    const runSearch = async () => {
      setIsLoading(true);
      try {
        const { assignments: newAssignments, hasMore: moreAvailable } =
          await fetchAction(0, query.trim());

        if (!isActive) return;
        setAssignments(newAssignments);
        setHasMore(moreAvailable);
        setBatchIndex(1);
      } catch (error) {
        if (isActive) {
          console.error("Error searching assignments:", error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      isActive = false;
    };
  }, [query]);

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
  }, [hasMore, isLoading, batchIndex, query]);

  if (!query.trim() && assignments.length === 0 && !isLoading) {
    return (
      <div className="mt-4">
        <Text size="2" color="gray">
          No available assignments yet. Check back later or create your own.
        </Text>
      </div>
    );
  }

  return (
    <Box>
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
        <Box>
          <InputGroup>
            <InputGroupInput
              id="explore-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for assignments"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {isLoading && <Spinner />}
            </InputGroupAddon>
          </InputGroup>
        </Box>
      </Box>

      {assignments.length === 0 && !isLoading && query.trim() ? (
        <Text size="2" color="gray">
          No assignments match your search.
        </Text>
      ) : (
        assignments.map((a) => (
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
