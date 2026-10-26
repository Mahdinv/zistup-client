import useDeleteMealLogsMutation from "../../../hooks/use-delete-meal-logs-mutation.hook";
import type { MealType } from "../../../api/types/add-meal.types";
import useMealLogsQuery from "../../../hooks/use-today-meal-logs-query.hook";
import { PiTrash } from "react-icons/pi";
import { memo, useMemo } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import { useQuickAddMealDrawer } from "../../../hooks/use-quick-add-meal-drawer.hook";
import TodayLoggedMealCard from "./today-logged-meal-card";

const mealOrder = {
  breakfast: 0,
  lunch: 1,
  snack: 2,
  dinner: 3,
} satisfies Record<MealType, number>;

const TodayLoggedMeals = ({
  date,
  isFuture,
  isToday,
}: {
  date: string;
  isFuture: boolean;
  isToday: boolean;
}) => {
  const mealLogsQuery = useMealLogsQuery(isFuture ? null : date);
  const deletion = useDeleteMealLogsMutation();
  const sortedMeals = useMemo(
    () =>
      [
        ...(mealLogsQuery.isFetchedAfterMount && mealLogsQuery.isSuccess
          ? (mealLogsQuery.data?.items ?? [])
          : []),
      ].sort((a, b) => mealOrder[a.meal] - mealOrder[b.meal]),
    [
      mealLogsQuery.data?.items,
      mealLogsQuery.isFetchedAfterMount,
      mealLogsQuery.isSuccess,
    ],
  );

  const { openQuickAddMeal } = useQuickAddMealDrawer();

  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-start gap-4
                "
    >
      <div
        className="
                  w-full
                  compact:min-h-6 fold:min-h-8 laptop:min-h-10
                  flex flex-row justify-between items-center
                "
      >
        <h2 className="flex-1 font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          {isToday
            ? "وعده‌های ثبت‌شده امروز"
            : "وعده‌های ثبت‌شده روز انتخاب‌شده"}
        </h2>
        {sortedMeals.length > 0 && (
          <button
            type="button"
            disabled={
              isFuture ||
              deletion.isPending ||
              !mealLogsQuery.isSuccess ||
              sortedMeals.length === 0
            }
            aria-busy={deletion.isPending && deletion.variables?.kind === "day"}
            onClick={() => !isFuture && deletion.remove({ kind: "day", date })}
            className="text-red-400 hover:text-red-500 active:text-red-500 flex flex-row justify-end items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg cursor-pointer">
              پاک کردن همه
            </span>
            <PiTrash
              className="compact:text-lg fold:text-xl laptop:text-2xl cursor-pointer"
              strokeWidth={1}
            />
          </button>
        )}
      </div>
      {!isFuture && !mealLogsQuery.isFetchedAfterMount ? (
        <div
          role="status"
          aria-label="در حال دریافت وعده‌های روز انتخاب‌شده"
          className="w-full space-y-2"
        >
          {[0, 1].map((row) => (
            <div
              key={row}
              className="h-20 rounded-xs bg-blue-300 dark:bg-darker-blue-200 animate-pulse motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : mealLogsQuery.isError ? (
        <div
          role="alert"
          className="w-full flex flex-col items-center gap-3 text-center"
        >
          <p>{getApiErrorMessage(mealLogsQuery.error)}</p>
          <button
            type="button"
            onClick={() => void mealLogsQuery.refetch()}
            className="btn btn-primary-green"
          >
            تلاش مجدد
          </button>
        </div>
      ) : sortedMeals.length === 0 ? (
        <div className="w-full bg-transparent border-2 border-dashed border-gray-200 dark:border-darker-blue-100 rounded-xs p-8 flex justify-center items-center">
          <button
            type="button"
            onClick={() => {
              if (isToday) openQuickAddMeal();
            }}
            disabled={!isToday}
            aria-haspopup="dialog"
            className="text-green-400 hover:text-green-500 active:text-green-500 flex flex-row items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            <span className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
              {isToday ? "ثبت غذای امروز" : "وعده‌ای برای این روز ثبت نشده است"}
            </span>
            <LuArrowUpLeft
              aria-hidden="true"
              className="compact:text-2xl fold:text-3xl laptop:text-4xl"
              strokeWidth={2.5}
            />
          </button>
        </div>
      ) : (
        <ol className="w-full flex flex-col items-center justify-start gap-4">
          {sortedMeals.map((item) => (
            <TodayLoggedMealCard
              key={item.id}
              item={item}
              deleteDisabled={isFuture || deletion.isPending}
              isDeleting={
                deletion.isPending &&
                deletion.variables?.kind === "single" &&
                deletion.variables.id === item.id
              }
              onDelete={() =>
                !isFuture &&
                deletion.remove({
                  kind: "single",
                  id: item.id,
                  date,
                })
              }
            />
          ))}
        </ol>
      )}
    </div>
  );
};

export default memo(TodayLoggedMeals);
