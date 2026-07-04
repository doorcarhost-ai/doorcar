import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-gray-100", className)} />;
}

export function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-premium">
      <Skeleton className="h-52 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function CarDetailSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-72 md:h-[420px] w-full" />
      <Skeleton className="h-8 w-2/3" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 space-y-3 shadow-premium">
      <div className="flex gap-3">
        <Skeleton className="h-16 w-24 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
