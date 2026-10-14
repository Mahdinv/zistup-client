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
    heading: "محتوای پیشنهاد اصلی",
    description: "جزئیات پیشنهاد اصلی این وعده در این بخش نمایش داده خواهد شد.",
  },
  {
    value: "alternative-1",
    label: "جایگزین اول",
    heading: "محتوای جایگزین اول",
    description:
      "جزئیات اولین جایگزین این وعده در این بخش نمایش داده خواهد شد.",
  },
  {
    value: "alternative-2",
    label: "جایگزین دوم",
    heading: "محتوای جایگزین دوم",
    description:
      "جزئیات دومین جایگزین این وعده در این بخش نمایش داده خواهد شد.",
  },
] as const;

type MealPlanTab = (typeof mealPlanTabs)[number]["value"];

type SuggestedMealsCardProps = {
  item: {
    mealTitle: string;
    mealColor?: string;
    id: string;
    title: string;
    source: string;
    category: string;
    imageUrl?: string | null;
    quantity: { grams: number; servings: number; unit: string };
    ingredients: string[];
    nutrition: {
      caloriesKcal: number;
      proteinG: number;
      carbohydrateG: number;
      fiberG: number;
    };
  };
};

const SuggestedMealsCard = ({ item }: SuggestedMealsCardProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<MealPlanTab>("primary");
  return (
    <>
      <article
        className="
                    w-full min-w-0 max-w-full
                    bg-blue-300 dark:bg-[#21262D]
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-2xl p-4 cursor-grab
                    flex flex-col items-start gap-4
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
            onClick={() => setDrawerOpen(true)}
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
          className="w-full
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
            if (tab) setActiveTab(tab.value);
          }}
        >
          <BaseDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title="جزئیات وعده پیشنهادی"
            header={
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-yekan font-extrabold compact:text-lg fold:text-xl laptop:text-2xl">
                  وعده پیشنهادی
                </h2>
                <span className="rounded-full border border-yellow-500 px-3 py-1 text-yellow-600 dark:text-yellow-500 font-peyda compact:text-sm fold:text-base">
                  {item.mealTitle}
                </span>
              </div>
            }
            headerContent={
              <Tabs.List
                aria-label="پیشنهادهای وعده"
                activateOnFocus
                className="-mb-3 grid grid-cols-3"
              >
                {mealPlanTabs.map((tab) => (
                  <Tabs.Tab
                    key={tab.value}
                    value={tab.value}
                    className="min-w-0 cursor-pointer border-b-2 border-transparent px-1 py-3 text-center font-peyda font-bold compact:text-xs mobile:text-sm fold:text-base text-blue-800 dark:text-blue-700 transition-colors data-active:border-blue-700 data-active:text-blue-900 dark:data-active:border-blue-600 dark:data-active:text-blue-400 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500"
                  >
                    {tab.label}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            }
            footer={
              <Button
                classes="btn btn-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                title="بستن"
                onClick={() => setDrawerOpen(false)}
              />
            }
          >
            {mealPlanTabs.map((tab) => (
              <Tabs.Panel
                key={tab.value}
                value={tab.value}
                className="flex flex-col gap-3 font-peyda focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <h3 className="font-bold compact:text-lg fold:text-xl">
                  {tab.heading}
                </h3>
                <p className="font-bold">{item.title}</p>
                <p className="leading-relaxed text-blue-900 dark:text-blue-500">
                  {tab.description}
                </p>
              </Tabs.Panel>
            ))}
          </BaseDrawer>
        </Tabs.Root>
      </DirectionProvider>
    </>
  );
};

export default memo(SuggestedMealsCard);
