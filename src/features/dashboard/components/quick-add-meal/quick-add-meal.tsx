import MealIcon from "./meal-icon";
import SearchBox from "@/shared/base-components/search-box";
import { toast } from "sonner";
import { createSubmission } from "../../lib/quick-add-meal/meal-submission";
import type { AddMealPayload } from "../../api/types/add-meal.types";
import useFoodInfoQuery from "../../hooks/use-food-info-query.hook";
import FoodDetailsResource from "./food-details-resource";
import useDebouncedValue from "@/shared/hooks/use-debounced-value.hook";
import { useReducer, useRef } from "react";
import BaseDrawer from "@/shared/base-components/base-drawer";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";
import useMealSearchQuery from "../../hooks/use-meal-search-query.hook";
import {
  getFoodSearchState,
  normalizeFoodSearch,
} from "../../lib/quick-add-meal/food-search.utils";
import { MEALS } from "../../constants/quick-add-meal.constants";
import {
  flowReducer,
  initialFlow,
} from "../../lib/quick-add-meal/quick-add-meal.state";
import MealSelection from "./meal-selection";
import FoodSearch from "./food-search";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (submission: AddMealPayload) => Promise<boolean>;
  isSubmitting: boolean;
};
export default function QuickAddMeal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) {
  const [state, dispatch] = useReducer(flowReducer, initialFlow);
  const submitted = useRef(false);
  const searchTerm = normalizeFoodSearch(state.query);
  const debouncedSearch = useDebouncedValue(searchTerm);
  const isDebouncing = searchTerm !== debouncedSearch;
  const mealSearchQuery = useMealSearchQuery(
    debouncedSearch,
    open && state.step === "search" && !state.nextStep && !isDebouncing,
  );
  const foodInfoQuery = useFoodInfoQuery(
    state.selectedFoodId,
    open && (state.step === "details" || state.nextStep === "details"),
  );
  const resolvedState = {
    ...state,
    quantity: {
      ...state.quantity,
      unitId:
        state.quantity.unitId || foodInfoQuery.data?.defaultUnitId || "bite",
    },
  };
  const { theme } = useDashboardTheme();
  const meal = MEALS.find((item) => item.id === state.mealId);
  const title =
    state.step === "meal"
      ? "ثبت سریع غذا برای کدوم وعده؟"
      : state.step === "search"
        ? `${meal?.title ?? ""} چی خوردی؟`
        : (foodInfoQuery.data?.title ?? "جزئیات غذا");
  const close = () => {
    if (!submitted.current) onClose();
  };
  const submit = async () => {
    if (!foodInfoQuery.isSuccess || submitted.current || isSubmitting) return;
    const submission = createSubmission(resolvedState, foodInfoQuery.data);
    if (!submission) {
      toast.error("امکان محاسبه مقدار غذا وجود ندارد");
      return;
    }
    submitted.current = true;
    try {
      if (await onSubmit(submission)) onClose();
    } finally {
      submitted.current = false;
    }
  };
  return (
    <BaseDrawer
      closeIcon={<MealIcon name="close" />}
      appearance="quick-add-meal"
      open={open && !state.nextStep}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen) return;
        if (!open) {
          dispatch({ type: "reset" });
          submitted.current = false;
        } else dispatch({ type: "transition-complete" });
      }}
      title={title}
      header={
        state.step === "details" && state.detailed ? (
          <div className="flex items-center gap-2">
            <span className="font-yekan text-[20px] leading-[1.2] font-extrabold">
              {title}
            </span>
            <span className="shrink-0 rounded-full border border-blue-900 px-2.5 py-1 text-sm leading-[1.4] font-bold text-blue-900 dark:border-blue-400 dark:text-blue-400">
              ثبت تفکیک شده
            </span>
          </div>
        ) : undefined
      }
      theme={theme}
      height="content"
      className="overflow-clip [&>[data-slot=drawer-content]]:overflow-clip"
      description="انتخاب وعده، جستجوی غذا و تنظیم مقدار مصرف"
      headerContent={
        state.step === "search" ? (
          <SearchBox
            appearance="quick-add-meal"
            icon={
              <>
                <MealIcon
                  name={state.query ? "search" : "search-light"}
                  className="size-6 dark:hidden"
                />
                <MealIcon
                  name="search"
                  className="hidden size-6 dark:inline-flex"
                />
              </>
            }
            value={state.query}
            aria-label="جستجوی غذا"
            placeholder="نام غذا یا خوراکی رو اینجا سرچ کن"
            action={
              <button
                type="button"
                aria-label="جستجوی صوتی (به‌زودی)"
                onClick={() => toast.info("جستجوی صوتی هنوز فعال نیست")}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500 bg-blue-300 text-blue-500 dark:border-blue-900 dark:bg-darker-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                <MealIcon name="mic" className="size-6" />
              </button>
            }
            onChange={(query) => dispatch({ type: "query", query })}
          />
        ) : undefined
      }
      footer={
        state.step !== "meal" ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: "back" })}
              disabled={!!state.nextStep || isSubmitting}
              className={`flex h-[42px] items-center justify-center gap-0.5 rounded-2xl border border-blue-500 bg-blue-300 px-2 font-bold text-xl leading-[1.45] shadow-[0_4px_4px_0_#0000000a] dark:shadow-none text-blue-700 dark:border-transparent dark:bg-darker-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400 ${state.step === "details" ? "w-1/3" : "w-full"}`}
            >
              <MealIcon name="back" />
              بازگشت
            </button>
            {state.step === "details" && (
              <button
                type="button"
                disabled={
                  !!state.nextStep || !foodInfoQuery.isSuccess || isSubmitting
                }
                onClick={submit}
                className="h-[42px] flex-1 rounded-2xl bg-green-400 font-bold text-xl leading-[1.45] shadow-[0_4px_4px_0_#0000000a] dark:shadow-none text-darker-green-200 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                {isSubmitting ? "در حال ثبت..." : "ثبت غذا"}
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      {state.step === "meal" && (
        <MealSelection
          onSelect={(mealId) => dispatch({ type: "meal", mealId })}
        />
      )}
      {state.step === "search" && (
        <FoodSearch
          state={getFoodSearchState(searchTerm, mealSearchQuery, isDebouncing)}
          onRetry={() => void mealSearchQuery.refetch()}
          onSelect={(food) => dispatch({ type: "food", foodId: food.id })}
        />
      )}
      {state.step === "details" && (
        <fieldset
          disabled={isSubmitting}
          className="min-w-0"
          aria-busy={isSubmitting}
        >
          <FoodDetailsResource
            state={resolvedState}
            resource={foodInfoQuery}
            dispatch={dispatch}
          />
        </fieldset>
      )}
    </BaseDrawer>
  );
}
