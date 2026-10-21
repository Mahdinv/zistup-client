import Slider from "@/shared/base-components/slider";
import {
  getIngredientGramValues,
  roundIngredientGrams,
} from "../../lib/quick-add-meal/ingredient-grams";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { formatMealNumber } from "../../lib/quick-add-meal/format-meal-number";
import type { FlowAction } from "../../lib/quick-add-meal/quick-add-meal.state";
import type { FlowState, Food } from "../../api/types/quick-add-meal.types";
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";
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
  const detailedAmounts = getIngredientGramValues(part?.initialAmount ?? 5);
  return (
    <>
      <div role="group" aria-label="اجزای غذا" className="mb-2 min-w-0 pb-2">
        <Slider
          items={food.parts}
          selectedIndex={food.parts.findIndex((item) => item.id === part?.id)}
          getKey={(item) => item.id}
          slides={{ perView: "auto", spacing: 10 }}
          slideClassName="!min-w-36 !max-w-36 py-1"
          renderItem={(item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => dispatch({ type: "part", partId: item.id })}
              title={item.title}
              aria-label={item.title}
              aria-pressed={part?.id === item.id}
              className={`flex h-18 w-full flex-col rounded-xl border px-2.5 pt-2 pb-1.5 text-right ${part?.id === item.id ? "border-blue-800 bg-blue-200 ring-1 ring-inset ring-blue-800 dark:border-blue-400 dark:bg-darker-blue-200 dark:ring-blue-400" : "border-blue-500 bg-blue-100 dark:border-dark dark:bg-darker-blue-300"} ${focus}`}
            >
              <span className="flex min-h-7 min-w-0 items-center justify-between gap-2">
                <span className="min-w-0 truncate font-bold text-sm">
                  {item.title}
                </span>
                <span dir="ltr" className="flex shrink-0 items-baseline gap-1">
                  <span className="font-rokh text-2xl leading-none text-orange-200">
                    {formatMealNumber(item.kcal)}
                  </span>
                  <small className="font-peyda text-[8px] font-bold">
                    kcal
                  </small>
                </span>
              </span>
              <span className="mt-1 flex min-h-0 flex-1 items-center justify-center gap-1 border-t border-blue-500/30 pt-1 text-blue-800 dark:border-darker-blue-100 dark:text-blue-700">
                <span className="font-rokh text-base leading-none">
                  {formatMealNumber(
                    state.detailed?.[item.id]?.amount ??
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
          appearance="dashboard"
          formatValue={formatMealNumber}
          label={`تنظیم مقدار ${part.title}`}
          value={detail.amount}
          customUnit={{
            label: "گرم",
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
      ) : null}
    </>
  );
}
