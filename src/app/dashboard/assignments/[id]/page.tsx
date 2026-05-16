import { Suspense } from "react";
import AssignmentDetailContent from "@/app/components/assignments/assignment-detail-content";
import AssignmentSkeleton from "@/app/components/assignments/assignment-detail-skeleton";

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-4 min-w-80">
      <Suspense fallback={<AssignmentSkeleton />}>
        <AssignmentDetailContent id={id} />
      </Suspense>
    </div>
  );
}
