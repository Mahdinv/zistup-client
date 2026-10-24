import { mealColors } from "../../../constants/meal-colors.constants";
import Slider from "@/shared/base-components/slider";
import { memo, useMemo, useState } from "react";
import SuggestedMealsCard from "./suggested-meals-card";
import type { DietMeal } from "@/features/dashboard/api/types/diet-day.types";

type PlanType = "primary" | "alternative-1" | "alternative-2";

const tabs = [
  { value: "primary", title: "پیشنهاد اصلی" },
  { value: "alternative-1", title: "جایگزین اول" },
  { value: "alternative-2", title: "جایگزین دوم" },
] satisfies { value: PlanType; title: string }[];

type DietGoalMealSuggestionsProps = {
  meals: DietMeal[] | undefined;
};

const DietGoalMealSuggestions = ({ meals }: DietGoalMealSuggestionsProps) => {
  const [activePlan, setActivePlan] = useState<PlanType>("primary");
  debugger;
  const displayDiets = useMemo(() => {
    return (meals ?? []).flatMap((meal) => {
      const selectedMeal =
        activePlan === "primary"
          ? meal.main
          : meal.alternatives[activePlan === "alternative-1" ? 0 : 1];
      const mealColor = mealColors.find(
        (mealColor) => mealColor.title === meal.title,
      )?.value;
      return selectedMeal
        ? [
            {
              ...selectedMeal,
              meal,
              mealId: meal.id,
              mealTitle: meal.title,
              mealColor,
            },
          ]
        : [];
    });
  }, [meals, activePlan]);
  // Keen caches slide elements. A new plan/meal set needs a fresh track at index 0.
  const sliderKey = JSON.stringify([
    activePlan,
    displayDiets.map(({ mealId, id }) => [mealId, id]),
  ]);
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
      <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
        وعده‌های پیشنهادی هدف رژیمی شما
      </h2>
      <div className="w-full min-w-0 flex flex-col items-start gap-3 [--meal-card-width:13rem] mobile:[--meal-card-width:14rem] fold:[--meal-card-width:15rem] laptop:[--meal-card-width:16rem] desktop:[--meal-card-width:17rem]">
        <ol className="w-full flex flex-row justify-self-auto items-center gap-1">
          {tabs.map((tab) => (
            <li
              key={tab.value}
              className={`
                            font-peyda font-bold leading-[140%] compact:text-xs mobile:text-sm fold:text-base laptop:text-sm desktop:text-base whitespace-nowrap
                            bg-blue-300 dark:bg-darker-blue-300
                            rounded-[29px] border
                            ${activePlan === tab.value ? "text-blue-900 dark:text-blue-700 border-blue-800 dark:border-blue-400" : "text-blue-500 dark:text-blue-900 border-blue-500 dark:border-dark"}
                            py-2.5 compact:px-2.5 fold:px-3.5 laptop:px-4.5 cursor-pointer
                        `}
              onClick={() => setActivePlan(tab.value)}
            >
              {tab.title}
            </li>
          ))}
        </ol>
        <div className="w-full min-w-0 max-w-[calc(var(--meal-card-width)*2.5+16px)] laptop:max-desktop:max-w-none">
          <Slider
            key={sliderKey}
            slides={{ origin: "auto", perView: "auto", spacing: 8 }}
            slideClassName="flex flex-col w-(--meal-card-width) min-w-(--meal-card-width) max-w-(--meal-card-width) shrink-0"
            getKey={(item) => item.mealId}
            items={displayDiets}
            renderItem={(item) => (
              <SuggestedMealsCard item={item} initialTab={activePlan} />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(DietGoalMealSuggestions);
