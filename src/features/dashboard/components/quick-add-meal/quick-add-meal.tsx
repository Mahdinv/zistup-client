import { useReducer, useRef } from "react";
import { PiCaretRight } from "react-icons/pi";
import BaseDrawer from "@/shared/base-components/base-drawer";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";
import { MEALS, searchFoods } from "./quick-add-meal.data";
import {
  createSubmission,
  flowReducer,
  initialFlow,
} from "./quick-add-meal.state";
import type { MealSubmission } from "./quick-add-meal.types";
import MealSelection from "./meal-selection";
import FoodSearch, { FoodSearchInput } from "./food-search";
import FoodDetails from "./food-details";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (submission: MealSubmission) => void;
};
export default function QuickAddMeal({ open, onClose, onSubmit }: Props) {
  const [state, dispatch] = useReducer(flowReducer, initialFlow);
  const submitted = useRef(false);
  const { theme } = useDashboardTheme();
  const meal = MEALS.find((item) => item.id === state.mealId);
  const title =
    state.step === "meal"
      ? "ثبت سریع غذا برای کدوم وعده؟"
      : state.step === "search"
        ? `${meal?.title ?? ""} چی خوردی؟`
        : (state.food?.title ?? "جزئیات غذا");
  const close = () => {
    onClose();
  };
  const submit = () => {
    const submission = createSubmission(state);
    if (!submission || submitted.current) return;
    submitted.current = true;
    onSubmit(submission);
    close();
  };
  return (
    <BaseDrawer
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
      theme={theme}
      height="content"
      className="overflow-clip [&>[data-slot=drawer-content]]:overflow-clip"
      description="انتخاب وعده، جستجوی غذا و تنظیم مقدار مصرف"
      headerContent={
        state.step === "search" ? (
          <FoodSearchInput
            query={state.query}
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
              disabled={!!state.nextStep}
              className={`flex min-h-11 items-center justify-center gap-1 rounded-full border border-blue-500 bg-blue-200 px-3 font-bold text-lg text-blue-700 dark:border-transparent dark:bg-darker-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400 ${state.step === "details" ? "w-1/3" : "w-full"}`}
            >
              <PiCaretRight />
              بازگشت
            </button>
            {state.step === "details" && (
              <button
                type="button"
                disabled={!!state.nextStep}
                onClick={submit}
                className="min-h-11 flex-1 rounded-full bg-green-400 font-bold text-lg text-darker-green-200 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-blue-400"
              >
                ثبت غذا
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
          state={searchFoods(state.query)}
          onSelect={(food) => dispatch({ type: "food", food })}
        />
      )}
      {state.step === "details" && state.food && (
        <FoodDetails state={state} food={state.food} dispatch={dispatch} />
      )}
    </BaseDrawer>
  );
}
