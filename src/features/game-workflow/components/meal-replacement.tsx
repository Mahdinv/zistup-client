import BaseDrawer from "@/shared/base-components/base-drawer";
import type { MealType } from "../api/meal-alternatives.api";
import useMealAlternativesQuery from "../hooks/use-meal-alternatives-query.hook";

export default function MealReplacement({
  open,
  onOpenChange,
  meal,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: MealType;
}) {
  const { isPending, isError, isFetching, refetch } =
    useMealAlternativesQuery(meal, open);

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="جایگزین کردن وعده"
      theme="dark"
    >
      <div className="font-peyda text-[13px] mobile:text-[14px] fold:text-[16px] laptop:text-[18px]">
        {isPending && <p role="status">در حال دریافت غذاهای جایگزین…</p>}
        {isError && (
          <div role="alert" className="flex flex-wrap items-center gap-2">
            <span>دریافت غذاهای جایگزین ناموفق بود.</span>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetch()}
              className="text-green-400 underline disabled:opacity-50"
            >
              تلاش دوباره
            </button>
          </div>
        )}
      </div>
    </BaseDrawer>
  );
}
