import { useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PiArrowUpLeft, PiFireFill } from "react-icons/pi";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { getGeneralUnits } from "./quick-add-meal.data";
import { getDetailedAmounts } from "./quick-add-meal.state";
import type { FlowAction } from "./quick-add-meal.state";
import type { FlowState, Food } from "./quick-add-meal.types";

const GENERAL_AMOUNTS = Array.from({ length: 1000 }, (_, i) => i + 1);
const number = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
const nutrients = [
  { key: "protein", label: "پروتئین", color: "bg-red-400" },
  { key: "fiber", label: "فیبر", color: "bg-green-400" },
  { key: "carbohydrates", label: "کربوهیدرات", color: "bg-orange-200" },
] as const;
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
  const detailedAmounts = useMemo(
    () => getDetailedAmounts(food, state.quantity),
    [food, state.quantity],
  );
  const units = useMemo(() => getGeneralUnits(food), [food]);
  const generalUnit = units.find((unit) => unit.id === state.quantity.unitId)!;
  const part = food.parts.find((item) => item.id === state.activePartId);
  const detail = part && state.detailed?.[part.id];
  const detailedUnit = part?.units.find((unit) => unit.id === detail?.unitId);
  return (
    <motion.div
      layout={!reduceMotion}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
      className="space-y-4"
    >
      <AnimatePresence initial={false}>
        {!state.detailed && food.parts.length > 1 && (
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
              {food.nutrition.kcal}
            </span>
            <small className="font-bold">kcal</small>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {nutrients.map((item) => (
            <div
              key={item.key}
              className="rounded-xl bg-darker-blue-200 px-1 py-2 text-center text-white dark:bg-darker-blue-500"
            >
              <p className="flex items-center justify-center gap-1 text-xs">
                <span className={`size-2 rounded-full ${item.color}`} />
                {item.label}
              </p>
              <p dir="ltr" className="mt-1">
                <span className="font-rokh text-xl">
                  {food.nutrition[item.key]}
                </span>
                <small className="ml-2">g</small>
              </p>
            </div>
          ))}
        </div>
      </motion.section>
      <motion.section
        layout={!reduceMotion}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="relative"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {state.detailed && part && detail && detailedUnit ? (
            <motion.div
              layout={!reduceMotion}
              key="detailed"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.14 }}
              className="rounded-3xl bg-blue-200 p-4 shadow-sm dark:bg-darker-blue-400"
            >
              <p className="mb-3 text-xs text-blue-800 dark:text-blue-400">
                ثبت تفکیک شده برای {number.format(state.quantity.amount)}{" "}
                {generalUnit.label}
              </p>
              <div
                role="group"
                aria-label="اجزای غذا"
                className="mb-2 flex gap-2 overflow-x-auto pb-2"
              >
                {food.parts.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => dispatch({ type: "part", partId: item.id })}
                    aria-pressed={part.id === item.id}
                    className={`min-w-28 shrink-0 rounded-xl border bg-blue-100 p-2 text-right dark:bg-darker-blue-300 ${part.id === item.id ? "border-blue-800 ring-1 ring-blue-800 dark:border-blue-400 dark:ring-blue-400" : "border-blue-500 dark:border-dark"} ${focus}`}
                  >
                    <span className="flex justify-between gap-2 font-bold">
                      {item.title}
                      <span className="font-rokh text-orange-200">
                        {item.kcal}
                        <small className="mr-1 font-peyda text-xxs">kcal</small>
                      </span>
                    </span>
                    <span className="text-xs text-blue-800">
                      {number.format(state.detailed?.[item.id]?.amount ?? 0)}{" "}
                      {
                        item.units.find(
                          (unit) =>
                            unit.id === state.detailed?.[item.id]?.unitId,
                        )?.label
                      }
                    </span>
                  </button>
                ))}
              </div>
              <QuantityPicker
                key={part.id}
                appearance="dashboard"
                label={`تنظیم مقدار ${part.title}`}
                unitWheel={{
                  options: part.units,
                  value: detail.unitId,
                  onChange: (unitId) =>
                    dispatch({
                      type: "detail",
                      partId: part.id,
                      quantity: { ...detail, unitId },
                    }),
                }}
                value={detail.amount}
                customUnit={{
                  label: `${detailedUnit.label} ${detailedUnit.description}`,
                  values: detailedAmounts,
                }}
                onChange={(amount) =>
                  dispatch({
                    type: "detail",
                    partId: part.id,
                    quantity: { ...detail, amount },
                  })
                }
              />
              <p className="mt-2 text-xs text-blue-800 dark:text-blue-500">
                {detailedUnit.description} • هر {generalUnit.label}:{" "}
                {number.format(
                  detailedUnit.amountPerGeneral[generalUnit.id] ?? 1,
                )}{" "}
                {detailedUnit.label}
              </p>
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
                {food.parts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "detailed" })}
                    className={`flex min-h-11 items-center gap-1 text-blue-800 dark:text-blue-400 ${focus}`}
                  >
                    <span className="underline underline-offset-4">
                      ثبت تفکیک شده
                    </span>
                    <PiArrowUpLeft />
                  </button>
                )}
              </div>
              <QuantityPicker
                appearance="dashboard"
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
