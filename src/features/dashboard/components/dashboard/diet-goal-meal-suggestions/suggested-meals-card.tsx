import type { DietFood, DietMeal } from "../../../api/types/diet-day.types";
import { MealType } from "../../../api/types/add-meal.types";
import useAddMealMutation from "../../../hooks/use-add-meal-mutation.hook";
import { toast } from "sonner";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Tabs } from "@base-ui/react/tabs";
import BaseDrawer from "@/shared/base-components/base-drawer";
import Button from "@/shared/base-components/button";
import { memo, useState } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import { PiFireSimpleFill } from "react-icons/pi";

const mealPlanTabs = [
  {
    value: "primary",
    label: "پیشنهاد اصلی",
  },
  {
    value: "alternative-1",
    label: "جایگزین اول",
  },
  {
    value: "alternative-2",
    label: "جایگزین دوم",
  },
] as const;

type MealPlanTab = (typeof mealPlanTabs)[number]["value"];

type SuggestedMealsCardProps = {
  item: DietFood & { meal: DietMeal; mealTitle: string; mealColor?: string };
  initialTab: MealPlanTab;
};
const SuggestedMealsCard = ({ item, initialTab }: SuggestedMealsCardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MealPlanTab>(initialTab);
  const { submitMeal, isPending, submissionInFlight } = useAddMealMutation();
  const foods = {
    primary: item.meal.main,
    "alternative-1": item.meal.alternatives[0],
    "alternative-2": item.meal.alternatives[1],
  };
  const submit = async () => {
    if (submissionInFlight.current) return;
    const food = foods[activeTab];
    if (!food) {
      toast.error("پیشنهاد انتخاب‌شده در پاسخ برنامه غذایی موجود نیست");
      return;
    }
    const meal = [
      "mid_morning_snack",
      "afternoon_snack",
      "pre_sleep_snack",
    ].includes(item.meal.key)
      ? MealType.Snack
      : Object.values(MealType).find((value) => value === item.meal.key);
    const foodId = food.foodId;
    if (!Number.isSafeInteger(foodId) || foodId <= 0) {
      toast.error(
        "برنامه غذایی کد دستور غذا را برگردانده است؛ شناسه عددی غذا (foodId) برای ثبت از سرور دریافت نشده است",
      );
      return;
    }
    if (!meal) {
      toast.error("نوع وعده در برنامه غذایی برای ثبت غذا معتبر نیست (meal)");
      return;
    }
    // The plan already supplies total grams; servings must not be multiplied again.
    if (!Number.isFinite(food.quantity.grams) || food.quantity.grams <= 0) {
      toast.error("وزن غذا به گرم در برنامه غذایی موجود یا معتبر نیست (value)");
      return;
    }
    if (
      await submitMeal({
        foodId,
        meal,
        value: food.quantity.grams,
        separatedItems: [],
      })
    )
      setDrawerOpen(false);
  };
  return (
    <>
      <article
        className="
                    w-full min-w-0 max-w-full
                    bg-blue-300 dark:bg-[#21262D]
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-2xl p-4 cursor-grab
                    flex flex-1 flex-col items-start gap-4
                "
      >
        <div className="w-full flex flex-row justify-between items-start">
          <label
            className="bg-transparent text-yellow-500 rounded-lg py-0.5 px-3 font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg"
            style={{
              border: `1px solid ${item.mealColor}`,
              color: item.mealColor,
            }}
          >
            {item.mealTitle}
          </label>
          <button
            type="button"
            aria-label={"نمایش جزئیات " + item.title}
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            data-keen-slider-clickable="true"
            onClickCapture={(event) => {
              // Keen retains click suppression after dragging. Handle this
              // explicit control before its native slider capture listener.
              event.stopPropagation();
              setActiveTab(initialTab);
              setDrawerOpen(true);
            }}
            className="compact:size-8 fold:size-9 laptop:size-10 rounded-full bg-green-400 hover:bg-green-500 active:bg-green-500 cursor-pointer flex justify-center items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 outline-none"
          >
            <LuArrowUpLeft
              className="text-darker-blue-300 compact:text-2xl fold:text-3xl laptop:text-4xl"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </button>
        </div>
        <h1 className="w-full min-w-0 wrap-anywhere font-peyda font-bold leading-[145%] compact:text-xl fold:text-2xl laptop:text-3xl">
          {item.title}
        </h1>
        <div
          className="mt-auto w-full
                   bg-[#0D321E] dark:bg-darker-blue-500
                    text-white
                    rounded-xl py-1 px-3
                    flex flex-row justify-between items-center"
        >
          <div className="flex flex-row items-center gap-1">
            <PiFireSimpleFill className="text-orange-300 compact:text-base fold:text-lg laptop:text-xl" />
            <label className="font-peyda font-medium compact:text-base fold:text-lg laptop:text-xl">
              کالری:
            </label>
          </div>
          <div className="flex-1 justify-end flex flex-row items-center gap-0.5">
            <small className="font-yekan font-normal leading-[120%] compact:text-sm fold:text-base laptop:text-lg">
              kcal
            </small>
            <label className="font-rokh font-semibold leading-[150%] compact:text-2xl fold:text-3xl laptop:text-4xl pt-1">
              {item.nutrition.caloriesKcal.toFixed()}
            </label>
          </div>
        </div>
      </article>
      <DirectionProvider direction="rtl">
        <Tabs.Root
          value={activeTab}
          onValueChange={(value: unknown) => {
            const tab = mealPlanTabs.find((tab) => tab.value === value);
            if (tab && !submissionInFlight.current) setActiveTab(tab.value);
          }}
        >
          <BaseDrawer
            className="bg-[#c3e6f3] text-darker-green-200 dark:text-gray-200 [--scroll-fade-color:#c3e6f3] **:data-[slot=base-drawer-footer]:px-3 **:data-[slot=base-drawer-footer]:pt-4 **:data-[slot=base-drawer-footer]:pb-[max(18px,env(safe-area-inset-bottom))] **:data-[slot=drawer-swipe-handle]:h-4.5 **:data-[slot=drawer-swipe-handle]:after:w-14.25 **:data-[slot=drawer-swipe-handle]:after:h-1.25 [&>[data-slot=drawer-content]>header]:px-4 [&>[data-slot=drawer-content]>header]:pb-0 [&>[data-slot=drawer-content]>header>div:first-child]:h-8 **:data-[slot=drawer-close]:size-6 [&_[data-slot=drawer-close]>svg]:size-6 **:data-[slot=base-drawer-body]:p-4 [&>[data-slot=drawer-content]>header>div:last-child]:mt-4"
            open={drawerOpen}
            onOpenChange={(open) => {
              if (!submissionInFlight.current) setDrawerOpen(open);
            }}
            title="جزئیات وعده پیشنهادی"
            header={
              <div className="flex items-center gap-2">
                <h2 className="font-yekan font-extrabold text-[20px] leading-[1.2]">
                  وعده پیشنهادی
                </h2>
                <span className="flex h-6 items-center rounded-full border border-yellow-500 px-3 text-yellow-600 dark:text-yellow-500 font-peyda text-[12px] font-bold leading-[1.4]">
                  {item.mealTitle}
                </span>
              </div>
            }
            headerContent={
              <Tabs.List
                aria-label="پیشنهادهای وعده"
                activateOnFocus
                className="-mb-px grid grid-cols-3"
              >
                {mealPlanTabs.map((tab) => (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    className="min-w-0 cursor-pointer border-b-2 border-transparent px-1 mobile:px-3 py-2 text-center font-peyda font-bold text-[14px] leading-[1.4] text-blue-700 transition-colors data-active:border-blue-700 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
                  >
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            }
            footer={
              <Button
                classes="h-[42px] rounded-full bg-green-400 text-darker-green-200 font-peyda font-bold !text-[18px] leading-[1.45] hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                title={isPending ? "در حال ثبت..." : "ثبت این غذا"}
                disable={isPending || !foods[activeTab]}
                onClick={() => void submit()}
              />
            }
          >
            {mealPlanTabs.map((tab) => {
              const food = foods[tab.value];
              return (
                <Tabs.Panel
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col gap-4 font-peyda"
                >
                  {food ? (
                    <>
                      <div>
                        <h3 className="font-bold text-[18px] leading-[1.45] dark:text-gray-50">
                          {food.title}
                        </h3>
                        <div className="flex items-center gap-1 text-[14px] font-bold leading-[1.4] text-blue-900">
                          <span>حجم:</span>
                          <span
                            dir="rtl"
                            className="inline-flex items-baseline gap-0.5"
                          >
                            <bdi className="font-rokh text-[16px] leading-[1.3]">
                              {food.quantity.servings}
                            </bdi>
                            <span className="text-[12px]">
                              {food.quantity.unit}
                            </span>
                          </span>
                          <span aria-hidden="true">/</span>
                          <span
                            dir="rtl"
                            className="inline-flex items-baseline gap-0.5"
                          >
                            <bdi className="font-rokh text-[14px] leading-[1.3]">
                              {Math.round(food.quantity.grams)}
                            </bdi>
                            <span className="text-[12px]">گرم</span>
                          </span>
                        </div>
                      </div>
                      <section className="rounded-2xl bg-blue-200 dark:bg-darker-blue-400 p-3 shadow-[0_4px_4px_#0000000a] dark:shadow-none">
                        <div className="flex h-9.75 items-center justify-between gap-2">
                          <span className="flex items-center gap-2 text-[14px] leading-[1.4] font-bold dark:text-blue-100">
                            <PiFireSimpleFill className="h-5 w-4 text-orange-200" />
                            کالری دریافتی
                          </span>
                          <span
                            dir="ltr"
                            className="isolate flex items-baseline gap-1"
                          >
                            <strong className="font-rokh text-[36px] font-extrabold leading-tight text-orange-200">
                              {Math.round(food.nutrition.caloriesKcal)}
                            </strong>{" "}
                            <span className="font-yekan text-[12px] font-extrabold leading-[1.2]">
                              kcal
                            </span>
                          </span>
                        </div>
                        <dl className="mt-2 grid grid-cols-3 gap-2">
                          {(
                            [
                              [
                                "پروتئین",
                                food.nutrition.proteinG,
                                "bg-[#ff7474]",
                              ],
                              ["فیبر", food.nutrition.fiberG, "bg-green-400"],
                              [
                                "کربوهیدرات",
                                food.nutrition.carbohydrateG,
                                "bg-orange-200",
                              ],
                            ] as const
                          ).map(([label, value, dotColor]) => (
                            <div
                              key={label}
                              className="flex min-w-0 flex-col items-center justify-center h-15.5 gap-3 rounded-xs bg-darker-blue-200 dark:bg-darker-blue-500 p-3 text-center"
                            >
                              <dt className="flex items-center gap-1 text-[12px] font-bold leading-[1.4] text-blue-100 dark:text-blue-800">
                                <span
                                  aria-hidden="true"
                                  className={`size-2 shrink-0 rounded-full ${dotColor}`}
                                />
                                {label}
                              </dt>
                              <dd
                                dir="ltr"
                                className="isolate flex h-3.25 items-center justify-center gap-0.75 font-rokh text-[20px] font-semibold leading-none text-blue-100"
                              >
                                <bdi className="relative top-px">{value}</bdi>{" "}
                                <span className="font-yekan text-[12px] font-extrabold text-blue-100 dark:text-blue-900">
                                  g
                                </span>
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </section>
                      <section className="rounded-2xl bg-blue-200 dark:bg-darker-blue-400 p-3 shadow-[0_4px_4px_#0000000a] dark:shadow-none">
                        <h4 className="text-[16px] leading-[1.4] font-bold">
                          ترکیبات:
                        </h4>
                        <ul className="mt-1 flex flex-wrap gap-1">
                          {food.ingredients.map((ingredient, index) => (
                            <li
                              key={index}
                              className="rounded-full border border-gray-100 text-blue-800 dark:border-darker-blue-100 px-1.5 py-0.5 text-[14px] font-medium leading-[1.4] dark:text-gray-50"
                            >
                              {ingredient}
                            </li>
                          ))}
                        </ul>
                      </section>
                      {food.companions.length > 0 && (
                        <section className="rounded-2xl min-h-17.25 border border-blue-500 dark:border-green-900 bg-blue-200 dark:bg-darker-blue-400 p-3 shadow-[0_4px_4px_#0000000a] dark:shadow-none">
                          <h4 className="text-[12px] font-medium leading-[1.4]">
                            همراه پیشنهادی این وعده:
                          </h4>
                          <ul className="mt-1 flex flex-col gap-1 text-[14px] text-blue-900 dark:text-blue-700">
                            {food.companions.map((companion) => (
                              <li key={companion.id} className="wrap-anywhere">
                                <span>{companion.title}</span>{" — "}
                                <bdi className="font-rokh">
                                  {companion.quantity.servings}
                                </bdi>{" "}
                                {companion.quantity.unit}{" / "}
                                <bdi className="font-rokh">
                                  {Math.round(companion.quantity.grams)}
                                </bdi>{" "}
                                گرم
                              </li>
                            ))}
                          </ul>
                        </section>
                      )}
                    </>
                  ) : (
                    <p>پیشنهادی برای این گزینه موجود نیست.</p>
                  )}
                </Tabs.Panel>
              );
            })}
          </BaseDrawer>
        </Tabs.Root>
      </DirectionProvider>
    </>
  );
};

export default memo(SuggestedMealsCard);
