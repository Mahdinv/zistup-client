import {
  GENERAL_AMOUNTS,
  nutrients,
  nutrientSlides,
} from "../../constants/nutrition-summary.constants";
import Slider from "@/shared/base-components/slider";
import DetailedQuantity from "./detailed-quantity";
import { formatMealNumber } from "../../lib/quick-add-meal/format-meal-number";
import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PiArrowUpLeft, PiFireFill } from "react-icons/pi";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { getGeneralUnits } from "../../lib/quick-add-meal/quantity-units.ts";
import type { FlowAction } from "../../lib/quick-add-meal/quick-add-meal.state";
import type { FlowState, Food } from "../../api/types/quick-add-meal.types";

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
  const units = useMemo(() => getGeneralUnits(food), [food]);
  const generalUnit = units.find((unit) => unit.id === state.quantity.unitId)!;
  return (
    <motion.div
      layout={!reduceMotion}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      className="space-y-4"
    >
      <AnimatePresence initial={false}>
        {!state.detailed && (
          <motion.aside
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            className="overflow-hidden bg-green-100 text-xs leading-relaxed dark:bg-darker-blue-400"
          >
            <div className="p-3">
              <h3 className="mb-1 font-bold text-base text-blue-700 dark:text-blue-400">
                این غذا چند ترکیب داره
              </h3>
              این محاسبات بر اساس ترکیب استاندارده. برای تنظیم دقیق وزن هر بخش،
              «ثبت تفکیک شده» رو بزن.
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <motion.section
        layout={!reduceMotion}
        aria-label="ارزش غذایی ترکیب استاندارد"
        className="rounded-3xl bg-blue-200 p-3 shadow-sm dark:bg-darker-blue-400"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-1 font-bold">
            <PiFireFill className="size-6 text-orange-300" />
            کالری دریافتی
          </h3>
          <span dir="ltr" className="flex items-baseline gap-2">
            <span className="font-rokh text-7xl text-orange-200">
              {formatMealNumber(food.nutrition.kcal)}
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
              <div className="flex h-20 flex-col justify-center rounded-xl bg-darker-blue-200 px-1.5 py-2 text-center text-white dark:bg-darker-blue-500">
                <p
                  title={item.label}
                  className="flex h-8 items-center justify-center gap-1 text-xs leading-4"
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 shrink-0 rounded-full ${item.color}`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </p>
                <p
                  dir="ltr"
                  className="mt-1 flex items-baseline justify-center gap-1"
                >
                  <span className="font-rokh text-xl leading-6">
                    {formatMealNumber(food.nutrition[item.key], item.precision)}
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
      <motion.section
        layout={!reduceMotion}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="relative"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {state.detailed ? (
            <motion.div
              layout={!reduceMotion}
              key="detailed"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.14 }}
              className="rounded-3xl bg-blue-200 p-4 shadow-sm dark:bg-darker-blue-400"
            >
              <DetailedQuantity state={state} food={food} dispatch={dispatch} />
            </motion.div>
          ) : (
            <motion.div
              layout={!reduceMotion}
              key="general"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.14 }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-bold">چه مقدار خوردی؟</h3>
                {
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "detailed",
                        food,
                        quantity: state.quantity,
                      })
                    }
                    className={`flex min-h-11 items-center gap-1 text-blue-800 dark:text-blue-400 ${focus}`}
                  >
                    <span className="underline underline-offset-4">
                      ثبت تفکیک شده
                    </span>
                    <PiArrowUpLeft />
                  </button>
                }
              </div>
              <QuantityPicker
                appearance="dashboard"
                formatValue={formatMealNumber}
                label=""
                unitWheel={{
                  options: units,
                  value: state.quantity.unitId,
                  onChange: (unitId) =>
                    dispatch({
                      type: "quantity",
                      quantity: { ...state.quantity, unitId },
                    }),
                }}
                value={state.quantity.amount}
                customUnit={{
                  label: generalUnit.label,
                  values: GENERAL_AMOUNTS,
                }}
                onChange={(amount) =>
                  dispatch({
                    type: "quantity",
                    quantity: { ...state.quantity, amount },
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </motion.div>
  );
}
