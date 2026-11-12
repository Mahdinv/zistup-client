import Slider from "@/shared/base-components/slider";
import {
  getIngredientGramValues,
  roundIngredientGrams,
  INGREDIENT_UNITS,
  ingredientQuantityToGrams,
} from "../../lib/quick-add-meal/ingredient-grams";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { formatMealNumber } from "../../lib/quick-add-meal/format-meal-number";
import type { FlowAction } from "../../lib/quick-add-meal/quick-add-meal.state";
import type { FlowState, Food } from "../../api/types/quick-add-meal.types";
import { useMemo } from "react";
import { calculateIngredientNutrition } from "../../lib/quick-add-meal/meal-nutrition";
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";
const ITEM_AMOUNTS = Array.from({ length: 201 }, (_, index) => index / 2);
const WHOLE_ITEM_AMOUNTS = Array.from({ length: 101 }, (_, index) => index);
const WHOLE_ITEM_UNITS = new Set(["spoon", "teaspoon", "handful", "bite", "cube"]);
export default function DetailedQuantity({
  state,
  food,
  dispatch,
}: {
  state: FlowState;
  food: Food;
  dispatch: (action: FlowAction) => void;
}) {
  const part =
    food.parts.find((item) => item.id === state.activePartId) ?? food.parts[0];
  const detail = part
    ? (state.detailed?.[part.id] ?? {
        unitId: "gram",
        amount: roundIngredientGrams(part.initialAmount ?? 5),
      })
    : undefined;
  const initialAmount = part?.initialAmount ?? 5;
  const detailedAmounts = useMemo(
    () => getIngredientGramValues(initialAmount),
    [initialAmount],
  );
  const calories = useMemo(
    () =>
      new Map(
        food.parts.map((item) => [
          item.id,
          calculateIngredientNutrition(state.detailed?.[item.id], item).kcal,
        ]),
      ),
    [food.parts, state.detailed],
  );
  return (
    <>
      <div role="group" aria-label="اجزای غذا" className="mb-2 min-w-0">
        <Slider
          items={food.parts}
          selectedIndex={food.parts.findIndex((item) => item.id === part?.id)}
          getKey={(item) => item.id}
          slides={{ perView: "auto", spacing: 8 }}
          slideClassName="!min-w-[120px] !max-w-[120px] py-0.5"
          renderItem={(item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => dispatch({ type: "part", partId: item.id })}
              title={item.title}
              aria-label={item.title}
              aria-pressed={part?.id === item.id}
              className={`flex h-[60px] w-full flex-col rounded-xs border p-2 text-right ${part?.id === item.id ? "border-blue-800 bg-blue-100 ring-1 ring-inset ring-blue-800 dark:border-blue-400 dark:bg-darker-blue-200 dark:ring-blue-400" : "border-blue-500 bg-blue-100 dark:border-dark dark:bg-darker-blue-300"} ${focus}`}
            >
              <span className="flex min-h-[18px] min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate font-bold text-base">
                  {item.title}
                </span>
                <span dir="ltr" className="flex shrink-0 items-baseline gap-1">
                  <span className="font-rokh text-2xl leading-none text-orange-200">
                    {formatMealNumber(calories.get(item.id))}
                  </span>
                  <small className="font-peyda text-[8px] font-bold">
                    kcal
                  </small>
                </span>
              </span>
              <span className="mt-1 flex min-h-0 flex-1 items-center justify-center gap-1 border-t border-blue-500/30 pt-1 text-blue-800 dark:border-dark dark:text-blue-700">
                <span className="font-rokh text-base leading-none">
                  {formatMealNumber(
                    (state.detailed?.[item.id] ? ingredientQuantityToGrams(state.detailed[item.id]) : null) ??
                      roundIngredientGrams(item.initialAmount ?? 5),
                  )}
                </span>
                <span className="text-[9px] leading-none">گرم</span>
              </span>
            </button>
          )}
        />
      </div>
      {part && detail ? (
        <QuantityPicker
          key={part.id}
          gramStepWheel={detail.unitId === "gram" ? {
            min: 0,
            max: detailedAmounts[detailedAmounts.length - 1],
            initialStep: 0.5,
          } : undefined}
          unitWheel={{
            options: food.type === "recipe" ? INGREDIENT_UNITS : INGREDIENT_UNITS.slice(0, 1),
            value: detail.unitId,
            onChange: (unitId) => dispatch({
              type: "detail",
              partId: part.id,
              quantity: { unitId, amount: detail.amount === 0 ? 0 : 1 },
            }),
          }}
          appearance="dashboard"
          formatValue={(value) => formatMealNumber(value, 2)}
          label={`تنظیم مقدار ${part.title}`}
          value={detail.amount}
          customUnit={{
            label: INGREDIENT_UNITS.find((unit) => unit.id === detail.unitId)?.label ?? "گرم",
            values: detail.unitId === "gram" ? detailedAmounts : WHOLE_ITEM_UNITS.has(detail.unitId) ? WHOLE_ITEM_AMOUNTS : ITEM_AMOUNTS,
          }}
          onChange={(amount) =>
            dispatch({
              type: "detail",
              partId: part.id,
              quantity: { ...detail, amount },
            })
          }
        />
      ) : null}
    </>
  );
}
