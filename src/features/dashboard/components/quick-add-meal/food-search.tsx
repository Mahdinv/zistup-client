import MealIcon from "./meal-icon";
import { formatServingUnit } from "../../api/types/serving-unit";
import { formatMealNumber } from "../../lib/quick-add-meal/format-meal-number";
import Button from "@/shared/base-components/button";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import type { MealSearchItem } from "../../api/types/meal-search.types";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { toast } from "sonner";
import type { SearchState } from "../../api/types/quick-add-meal.types";
export default function FoodSearch({
  state,
  onSelect,
  onRetry,
}: {
  state: SearchState;
  onSelect: (food: MealSearchItem) => void;
  onRetry: () => void;
}) {
  if (state.status === "loading")
    return (
      <div role="status" aria-label="در حال جستجوی غذا" className="space-y-2">
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="h-[55px] rounded-2xl bg-blue-200 dark:bg-darker-blue-300 animate-pulse motion-reduce:animate-none"
          />
        ))}
        <span className="sr-only">در حال دریافت غذاها...</span>
      </div>
    );
  if (state.status === "error")
    return (
      <div
        role="alert"
        className="flex min-h-66 flex-col items-center justify-center gap-4 text-center"
      >
        <p>{getApiErrorMessage(state.error)}</p>
        <Button
          classes="btn btn-primary-green"
          title="تلاش مجدد"
          onClick={onRetry}
        />
      </div>
    );
  if (state.status === "results")
    return (
      <ScrollFade
        wrapperClassName="[--result-row:55px] [--result-gap:0.5rem] h-[calc(var(--result-row)*4+var(--result-gap)*3)]"
        className="overscroll-contain"
      >
        <ul aria-label="نتایج جستجوی غذا" className="space-y-(--result-gap)">
          {state.foods.map((food) => (
            <li
              key={food.id}
              className="flex h-(--result-row) items-center gap-2 rounded-2xl bg-darker-blue-200 py-2 px-3 text-white dark:bg-darker-blue-500"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-lg">{food.name}</h3>
                <p className="truncate text-xs text-blue-700">
                  واحد: {formatServingUnit(food.serving_unit)}
                </p>
              </div>
              <span className="flex flex-row-reverse items-baseline gap-1 text-orange-200">
                <span className="font-rokh text-2xl">
                  {formatMealNumber(food.nutrition.calories_kcal)}
                </span>
                <small className="text-white text-xxs">kcal</small>
              </span>
              <button
                type="button"
                onClick={() => onSelect(food)}
                aria-label={`افزودن ${food.name}`}
                className="flex size-[35px] shrink-0 items-center justify-center rounded-xs bg-green-400 text-darker-green-200 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <MealIcon name="plus" />
              </button>
            </li>
          ))}
        </ul>
      </ScrollFade>
    );
  return (
    <div
      role="status"
      className="flex min-h-[155px] flex-col items-center justify-center gap-2 text-sm leading-[1.4] text-center"
    >
      {state.status === "idle" ? (
        <>
          <MealIcon name="search-empty" />
          <p>منتظر جستجوی تو هستیم...</p>
          <p className="max-w-[196px] text-blue-800">
            اسم غذا رو بالا تایپ کن یا با دکمه میکروفون اسمش رو بگو.
          </p>
        </>
      ) : (
        <>
          <ImageWithSkeleton
            src="/pwa/add-meal/food-not-found.webp"
            alt=""
            wrapperClassName="h-[94px] w-[106px]"
            className="h-full w-full object-contain"
          />
          <p>متاسفم، غذایی با این نام پیدا نشد.</p>
          <button
            type="button"
            onClick={() =>
              toast.info("افزودن غذای جدید در نسخه بعدی فعال می‌شود")
            }
            className="flex h-8 items-center gap-2 rounded-xs border-2 border-blue-800 px-2.5 font-bold text-base text-blue-800 dark:border-blue-400 dark:text-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            <MealIcon name="add" />
            افزودن غذای جدید
          </button>
        </>
      )}
    </div>
  );
}
