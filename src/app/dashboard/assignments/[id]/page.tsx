import { Suspense } from "react";
import AssignmentDetailContent from "@/app/components/assignment-detail-content";
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
        <AssignmentDetailContent id={id} />
      </Suspense>
    </div>
  );
}
