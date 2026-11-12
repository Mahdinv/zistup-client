import MealIcon from "./meal-icon";
import {
  GENERAL_AMOUNTS,
  nutrients,
  nutrientSlides,
} from "../../constants/nutrition-summary.constants";
import Slider from "@/shared/base-components/slider";
import DetailedQuantity from "./detailed-quantity";
import { formatMealNumber } from "../../lib/quick-add-meal/format-meal-number";
import { calculateMealNutrition } from "../../lib/quick-add-meal/meal-nutrition";
import { Activity, memo, useEffect, useMemo } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { getGeneralUnits } from "../../lib/quick-add-meal/quantity-units.ts";
import type { FlowAction } from "../../lib/quick-add-meal/quick-add-meal.state";
import type {
  FlowState,
  Food,
  QuantitySelection,
  DetailedSelection,
} from "../../api/types/quick-add-meal.types";
import { PiFadersFill } from "react-icons/pi";
import { HiOutlineChevronLeft } from "react-icons/hi";

const SERVING_AMOUNTS = Array.from(
  { length: 200 },
  (_, index) => (index + 1) / 2,
);
const WHOLE_UNIT_IDS = new Set([
  "spoon",
  "teaspoon",
  "handful",
  "bite",
  "cube",
]);

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

export default function FoodDetails({
  state,
  food,
  dispatch,
}: {
  state: FlowState;
  food: Food;
  dispatch: (action: FlowAction) => void;
}) {
  const reduceMotion = useReducedMotion();
  const isDetailed = Boolean(state.detailed);
  const controls = useAnimationControls();
  useEffect(() => {
    // Animate the mode change without measuring or animating its height.
    controls.set({ opacity: reduceMotion ? 1 : 0.6, y: reduceMotion ? 0 : 6 });
    void controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.16, ease: "easeOut" },
    });
    return () => controls.stop();
  }, [isDetailed, reduceMotion, controls]);
  const units = useMemo(() => getGeneralUnits(food), [food]);
  const generalUnit = units.find((unit) => unit.id === state.quantity.unitId)!;
  return (
    <div className="space-y-4 text-base">
      {food.type === "recipe" && !state.detailed && (
        <aside className="overflow-hidden bg-green-100 text-sm leading-[1.4] dark:bg-darker-blue-400">
          <div className="p-3">
            <h3 className="mb-1 font-bold text-base text-blue-700 dark:text-blue-400">
              این غذا چند ترکیب داره
            </h3>
            این محاسبات بر اساس ترکیب استاندارده. برای تنظیم دقیق وزن هر بخش،
            «ثبت تفکیک شده» رو بزن.
          </div>
        </aside>
      )}
      <NutritionSummary
        food={food}
        quantity={state.quantity}
        isDetailed={isDetailed}
        detailed={state.detailed}
      />
      <motion.section
        layout={reduceMotion ? false : "position"}
        layoutDependency={isDetailed}
        animate={controls}
        transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
        className="relative"
      >
        {/* Activity retains wheel state and suspends hidden scroll/slider effects. */}
        <Activity mode={isDetailed ? "visible" : "hidden"}>
          <div className="rounded-2xl bg-blue-300 p-4 shadow-[0_4px_4px_0_#0000000a] dark:shadow-none dark:bg-darker-blue-400">
            <DetailedQuantity state={state} food={food} dispatch={dispatch} />
          </div>
        </Activity>
        <Activity mode={isDetailed ? "hidden" : "visible"}>
          <div>
            <div className="mb-2">
              <h3 className="font-bold">چه مقدار خوردی؟</h3>
            </div>
            <QuantityPicker
              gramStepWheel={
                state.quantity.unitId === "gram"
                  ? {
                      min: food.type === "base_food" ? 0.5 : 1,
                      max: 2000,
                      initialStep: food.type === "base_food" ? 0.5 : 1,
                    }
                  : undefined
              }
              appearance="dashboard"
              formatValue={(value) => formatMealNumber(value, 2)}
              label=""
              unitWheel={{
                options: units,
                value: state.quantity.unitId,
                onChange: (unitId) =>
                  dispatch({
                    type: "quantity",
                    quantity: {
                      ...state.quantity,
                      unitId,
                      amount:
                        food.type === "base_food"
                          ? WHOLE_UNIT_IDS.has(unitId)
                            ? 1
                            : 0.5
                          : unitId === "serving"
                            ? 0.5
                            : unitId === "gram"
                              ? 1
                              : state.quantity.amount,
                    },
                  }),
              }}
              value={state.quantity.amount}
              customUnit={{
                label: generalUnit.label,
                values:
                  (food.type === "base_food" &&
                    !WHOLE_UNIT_IDS.has(state.quantity.unitId)) ||
                  state.quantity.unitId === "serving"
                    ? SERVING_AMOUNTS
                    : GENERAL_AMOUNTS,
              }}
              onChange={(amount) =>
                dispatch({
                  type: "quantity",
                  quantity: { ...state.quantity, amount },
                })
              }
            />
            {food.type === "recipe" && (
              <button
                type="button"
                dir="rtl"
                onClick={() =>
                  dispatch({
                    type: "detailed",
                    food,
                    quantity: state.quantity,
                  })
                }
                className={`mt-4 flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-[#292F37] bg-darker-blue-500 px-3 py-[9px] text-right font-peyda ${focus}`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-darker-blue-200">
                    <PiFadersFill
                      size={24}
                      className="text-blue-400"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col leading-[1.4]">
                    <span className="text-base font-bold text-blue-400">
                      ثبت تفکیک شده
                    </span>
                    <span className="text-sm font-medium text-blue-900">
                      مقدار هر بخش رو دقیق‌تر ثبت کن
                    </span>
                  </span>
                </span>
                <HiOutlineChevronLeft
                  size={24}
                  className="shrink-0 text-blue-400"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        </Activity>
      </motion.section>
    </div>
  );
}

const NutritionSummary = memo(function NutritionSummary({
  food,
  quantity,
  isDetailed,
  detailed,
}: {
  food: Food;
  quantity: QuantitySelection;
  isDetailed: boolean;
  detailed: DetailedSelection | null;
}) {
  const reduceMotion = useReducedMotion();
  const nutrition = useMemo(
    () => calculateMealNutrition(quantity, food, detailed),
    [quantity, food, detailed],
  );
  return (
    <motion.section
      layout={reduceMotion ? false : "position"}
      layoutDependency={isDetailed}
      transition={{ duration: reduceMotion ? 0 : 0.16, ease: "easeOut" }}
      aria-label={
        isDetailed ? "ارزش غذایی ترکیب تفکیک شده" : "ارزش غذایی ترکیب استاندارد"
      }
      className="rounded-2xl bg-blue-300 p-3 shadow-[0_4px_4px_0_#0000000a] dark:shadow-none dark:bg-darker-blue-400"
    >
      <div className="mb-2 flex h-[39px] items-center justify-between gap-2">
        <h3 className="flex items-center gap-1 font-bold">
          <MealIcon name="flame" />
          کالری دریافتی
        </h3>
        <span dir="ltr" className="flex items-baseline gap-2">
          <span className="font-rokh text-8xl text-orange-200">
            {formatMealNumber(nutrition.kcal)}
          </span>
          <small className="font-bold">kcal</small>
        </span>
      </div>
      <div
        role="group"
        aria-label="شاخص‌های تغذیه و محیط زیست"
        className="min-w-0"
      >
        <Slider
          items={nutrients}
          getKey={(item) => item.key}
          slides={nutrientSlides}
          slideClassName="!min-w-44 !max-w-44"
          renderItem={(item) => (
            <div className="flex h-[62px] flex-col justify-center rounded-xs bg-darker-blue-200 px-1.5 py-2 text-center text-white dark:bg-darker-blue-500">
              <p
                title={item.label}
                className="flex h-[13px] items-center justify-center gap-1 text-sm leading-4"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 rounded-full ${item.color}`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </p>
              <p
                dir="ltr"
                className="mt-3 flex items-baseline justify-center gap-1"
              >
                <span className="font-rokh text-2xl leading-6">
                  {formatMealNumber(nutrition[item.key], item.precision)}
                </span>
                <small className="text-[10px]">
                  <bdi>{item.unit}</bdi>
                </small>
              </p>
            </div>
          )}
        />
      </div>
    </motion.section>
  );
});
