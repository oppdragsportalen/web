import { Suspense } from "react";
import ExploreDetailContent from "@/app/components/explore-detail-content";
import AssignmentSkeleton from "@/app/components/assignment-detail-skeleton";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-4 min-w-xl">
      <Suspense fallback={<AssignmentSkeleton />}>
        <ExploreDetailContent id={id} />
      </Suspense>
    </div>
  );
}
