import { memo } from "react";
import type { FoodGroup } from "@/features/game-workflow/api/food-group.types";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";

const numberFormat = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const formatQuantity = (value: number) =>
  numberFormat.format(value).replace("٫", ".");
const validQuantity = (value: number | null | undefined): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

const FoodGroupItem = ({ foodGroup }: { foodGroup: FoodGroup }) => {
  const current = foodGroup.provided?.value;
  const target = foodGroup.wanted?.value;
  const hasCurrent = validQuantity(current);
  const hasTarget = validQuantity(target);
  const progress =
    hasCurrent && hasTarget && target > 0
      ? Math.min(100, (current / target) * 100)
      : null;

  return (
    <article className="flex w-full items-center gap-3 rounded-[20px] bg-blue-200 px-3 py-2 text-darker-green-200 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] dark:bg-[#19191B] dark:text-white">
      <ImageWithSkeleton
        src={foodGroup.properties.imageUrl}
        wrapperClassName="size-10 shrink-0 fold:size-12"
        className="size-full object-contain"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 font-peyda text-sm font-bold fold:text-base">
          <h3>{foodGroup.title}</h3>
          <span
            dir="rtl"
            className="inline-flex flex-wrap items-baseline gap-1 font-peyda"
            aria-label={`مقدار فعلی: ${hasCurrent ? formatQuantity(current) : "نامشخص"}، هدف: ${hasTarget ? formatQuantity(target) : "نامشخص"} ${foodGroup.properties.unit}`}
          >
            <bdi dir="ltr" className="font-rokh">
              <span className="text-green-800 dark:text-green-400">
                {hasCurrent ? formatQuantity(current) : "—"}
              </span>
              /{hasTarget ? formatQuantity(target) : "—"}
            </bdi>
            <span>{foodGroup.properties.unit}</span>
          </span>
        </div>
        {progress !== null ? (
          <div
            role="progressbar"
            aria-label={`پیشرفت ${foodGroup.title}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-1.5 overflow-hidden rounded-full bg-green-300 dark:bg-darker-blue-500"
          >
            <div
              className="h-full rounded-full bg-green-800"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <span className="font-peyda text-xs text-blue-900 dark:text-gray-400">
            اطلاعات کافی برای محاسبه پیشرفت موجود نیست
          </span>
        )}
      </div>
    </article>
  );
};

export default memo(FoodGroupItem);
