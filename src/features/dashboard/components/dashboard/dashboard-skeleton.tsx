import type { ReactNode } from "react";
import Skeleton from "react-loading-skeleton";

// Inherit the dashboard palette instead of the app's fixed dark SkeletonTheme.
export function LoadingShape({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`dashboard-skeleton block leading-none ${className}`}
    >
      <Skeleton
        inline
        width="100%"
        height="100%"
        baseColor="var(--dashboard-skeleton-base)"
        highlightColor="var(--dashboard-skeleton-highlight)"
        duration={1.8}
        borderRadius="inherit"
        containerClassName="block h-full rounded-[inherit]"
      />
    </span>
  );
}

export function LoadingRegion({
  children,
  label,
  className = "",
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div role="status" aria-label={label} className={className}>
      {children}
    </div>
  );
}

export function RingSkeleton({ calories = false }: { calories?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`relative shrink-0 ${calories ? "compact:size-22.5 mobile:size-24 mobile-lg:size-28 fold:size-32 tablet:size-29 laptop:size-36" : "size-35 fold:size-40 laptop:size-44"}`}
    >
      <LoadingShape className="size-full rounded-full" />
      <div className="absolute inset-[15%] flex items-center justify-center rounded-full bg-blue-100 dark:bg-darker-blue-400">
        <LoadingShape className="h-7 w-2/5 rounded-lg" />
      </div>
    </div>
  );
}

export function MonitoringSkeleton() {
  return (
    <LoadingRegion
      label="در حال دریافت اطلاعات تغذیه"
      className="flex h-72 w-full flex-col gap-3 desktop:h-64"
    >
      <div
        aria-hidden="true"
        className="relative flex-1 border-b border-blue-300 dark:border-darker-blue-100"
      >
        <svg viewBox="0 0 320 200" preserveAspectRatio="none" className="absolute inset-0 size-full fill-none stroke-blue-300 dark:stroke-darker-blue-100">
          <path d="M0 40H320 M0 80H320 M0 120H320 M0 160H320" strokeDasharray="4 6" />
          <path d="M8 150L68 100L128 120L188 65L248 85L312 40" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex justify-around gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <LoadingShape key={i} className="h-3 w-10 rounded" />
        ))}
      </div>
    </LoadingRegion>
  );
}

export function RecommendationSkeleton() {
  return (
    <LoadingRegion
      label="در حال دریافت توصیه‌ها"
      className="w-full space-y-1.5"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xxs border border-blue-300 px-4.5 py-2.5 dark:border-darker-blue-100"
        >
          <LoadingShape className="size-6 shrink-0 rounded fold:size-8 laptop:size-7" />
          <LoadingShape
            className={`h-5 ${i % 2 ? "w-2/3" : "w-1/2"} rounded`}
          />
          <LoadingShape className="size-5 rounded-full fold:size-6 laptop:size-8" />
        </div>
      ))}
    </LoadingRegion>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-blue-100 p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] dark:border-dark dark:bg-darker-blue-400">
      {children}
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <LoadingRegion
      label="در حال دریافت برنامه غذایی"
      className="flex w-full flex-col gap-4"
    >
      <Card>
        <LoadingShape className="h-6 w-1/3 self-start rounded" />
        <LoadingShape className="h-14 w-full rounded-lg" />
        <div className="grid w-full grid-cols-7 gap-2">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <LoadingShape className="size-8 rounded-full fold:size-9 laptop:size-10" />
              <LoadingShape className="h-5 w-8 rounded" />
            </div>
          ))}
        </div>
      </Card>
      <div className="flex items-center justify-between rounded-4xl border border-gray-100 bg-blue-100 p-2 dark:border-dark dark:bg-darker-blue-400">
        <LoadingShape className="size-8 rounded-full" />
        <LoadingShape className="h-8 w-1/2 rounded fold:h-9 laptop:h-12" />
        <LoadingShape className="size-8 rounded-full" />
      </div>
      <Card>
        <LoadingShape className="h-6 w-2/3 self-start rounded" />
        <RingSkeleton />
        <LoadingShape className="h-8.25 w-full rounded-full fold:h-10 laptop:h-11" />
      </Card>
      <Card>
        <LoadingShape className="h-6 w-2/3 self-start rounded" />
        <div className="flex w-full gap-2">
          {[0, 1, 2].map((i) => (
            <LoadingShape key={i} className="h-10 w-1/3 rounded-full" />
          ))}
        </div>
        <div className="flex w-full gap-2 overflow-hidden">
          {[0, 1].map((i) => (
            <LoadingShape
              key={i}
              className="h-64 w-52 shrink-0 rounded-xl mobile:w-56 fold:w-60 laptop:w-64"
            />
          ))}
        </div>
      </Card>
      <div className="flex gap-3">
        {[0, 1].map((i) => (
          <Card key={i}>
            <LoadingShape className="h-6 w-full rounded" />
            <RingSkeleton calories />
            <LoadingShape className="h-8 w-3/4 rounded" />
          </Card>
        ))}
      </div>
      <Card>
        <LoadingShape className="h-6 w-1/2 self-start rounded" />
        <LoadingShape className="h-24 w-full rounded-lg" />
      </Card>
      <Card>
        <LoadingShape className="h-6 w-1/2 self-start rounded" />
        <LoadingShape className="mx-auto aspect-square w-2/3 max-w-80 rounded-full" />
      </Card>
      <Card>
        <div className="flex w-full flex-wrap justify-between gap-3">
          <LoadingShape className="h-10 w-24 rounded" />
          <LoadingShape className="h-10 w-44 rounded-full" />
        </div>
        <MonitoringSkeleton />
      </Card>
      <Card>
        <LoadingShape className="h-6 w-1/2 self-start rounded" />
        <RecommendationSkeleton />
      </Card>
      <Card>
        <LoadingShape className="h-6 w-2/3 self-start rounded" />
        <LoadingShape className="h-24 w-full rounded-lg" />
      </Card>
    </LoadingRegion>
  );
}
