import { useState } from "react";
import { PiFireFill } from "react-icons/pi";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import ScrollFade from "@/shared/base-components/scroll-fade";
import useWeeklyDietPlanQuery from "../hooks/use-weekly-diet-plan-query.hook";
import WeeklyMealCard from "../components/weekly-meal-card";
import MealReplacement from "../components/meal-replacement";
import type { MealType } from "../api/meal-alternatives.api";

const formatValue = (value?: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.round(value).toLocaleString("fa-IR", { useGrouping: false })
    : "—";

const WeeklyDietPlanningPage = () => {
  const [activeMeal, setActiveMeal] = useState<MealType>("breakfast");
  const [replacementOpen, setReplacementOpen] = useState(false);
  const { data, isPending, isError, isFetching, refetch } =
    useWeeklyDietPlanQuery();
  const summary = data?.success ? data.data.summary : undefined;
  const nutrients = [
    {
      label: "پروتئین",
      value: summary?.daily_average?.protein_g,
      color: "bg-[#FF7075]",
    },
    {
      label: "فیبر",
      value: summary?.daily_average?.fiber_g,
      color: "bg-[#21DF84]",
    },
    {
      label: "کربوهیدرات",
      value: summary?.daily_average?.carbohydrate_g,
      color: "bg-[#FFA044]",
    },
  ];

  return (
    <PlaygroundFlowContainer>
      <div className="flex h-full min-h-0 flex-col overflow-hidden mt-2">
        <section
          dir="rtl"
          aria-label="خلاصه کالری و مواد مغذی"
          className="flex w-full min-w-0 shrink-0 flex-col gap-[0.571em] rounded-2xl bg-[#1B1A20] p-3.5 laptop:p-4 font-peyda text-[13px] text-[#F3F6F8] mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
        >
          <div className="flex items-center justify-between gap-[0.571em]">
            <div className="flex min-w-0 items-center gap-[0.571em]">
              <span className="flex size-[2.286em] shrink-0 items-center justify-center rounded-[0.714em] bg-[#21262D]">
                <PiFireFill
                  aria-hidden="true"
                  className="size-[1.714em] text-[#FF8916]"
                />
              </span>
              <h2 className="text-[1em] leading-[1.43] font-bold">
                میانگین کالری روزانه
              </h2>
            </div>
            <div
              dir="ltr"
              className="flex shrink-0 items-baseline gap-[0.571em]"
            >
              <span className="font-rokh text-[2.143em] leading-[1.067] text-[#FFA044]">
                {formatValue(1818)}
              </span>
              <span className="text-[0.786em] font-extrabold">kcal</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[0.571em]">
            {nutrients.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex min-w-0 flex-col items-center justify-center gap-[0.571em] rounded-[0.714em] bg-[#0D0E10] px-[0.286em] py-[0.714em] font-yekan laptop:gap-[0.429em]"
              >
                <div className="flex items-center justify-center gap-[0.333em] text-[0.857em] leading-none font-bold text-[#527B88]">
                  <span
                    aria-hidden="true"
                    className={`size-[0.667em] shrink-0 rounded-full ${color}`}
                  />
                  <span className="translate-y-[0.08em]">{label}</span>
                </div>
                <div
                  dir="ltr"
                  className="flex items-center justify-center gap-[0.286em] leading-none"
                >
                  <span className="translate-y-[0.08em] text-[1.429em] font-bold tabular-nums laptop:text-[1.143em]">
                    {formatValue(value)}
                  </span>
                  <span className="translate-y-[0.08em] text-[0.714em] font-extrabold text-[#527B88]">
                    g
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-[0.571em] border-t border-[#2B3038] pt-[0.571em] text-[#FFA044]">
            <span className="text-[1em] leading-[1.43] font-extrabold">
              هدف روزانه
            </span>
            <div dir="ltr" className="flex items-baseline gap-[0.571em]">
              <span className="font-rokh text-[1.714em] leading-none pt-1">
                {formatValue(summary?.daily_calorie_target_kcal)}
              </span>
              <span className="text-[0.786em] font-extrabold text-[#F3F6F8]">
                kcal
              </span>
            </div>
          </div>
        </section>
        <div
          dir="rtl"
          role="group"
          aria-label="وعده غذایی"
          className="mt-[1em] flex w-full shrink-0 items-center gap-[1.714em] rounded-lg border border-[#292F37] bg-[#1C2026] px-1.5 py-1.25 font-peyda text-[13px] mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
        >
          {([
            { key: "breakfast", label: "صبحانه" },
            { key: "lunch", label: "ناهار" },
            { key: "dinner", label: "شام" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeMeal === key}
              onClick={() => setActiveMeal(key)}
              className={`min-w-0 flex-1 cursor-pointer rounded-sm py-[0.286em] text-[1em] leading-[1.43] font-bold text-white transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${activeMeal === key ? "bg-[#12663F]" : "bg-transparent"} outline-none`}
            >
              {label}
            </button>
          ))}
        </div>
        <ScrollFade wrapperClassName="mt-3 h-auto min-h-0 flex-1">
          {isPending && (
            <p
              role="status"
              className="pb-3 text-center font-peyda text-[13px] text-white mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
            >
              در حال دریافت برنامه غذایی…
            </p>
          )}
          {isError && (
            <div
              role="alert"
              className="flex items-center justify-center gap-2 pb-3 font-peyda text-[13px] text-white mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
            >
              <span>دریافت برنامه غذایی ناموفق بود.</span>
              <button
                type="button"
                disabled={isFetching}
                onClick={() => void refetch()}
                className="text-green-400 underline disabled:opacity-50"
              >
                تلاش دوباره
              </button>
            </div>
          )}
          <div className="flex w-full flex-col gap-3">
            {[
              "شنبه",
              "یکشنبه",
              "دوشنبه",
              "سه‌شنبه",
              "چهارشنبه",
              "پنجشنبه",
              "جمعه",
            ].map((day, index) => (
              <WeeklyMealCard
                key={day}
                day={day}
                onReplace={() => setReplacementOpen(true)}
                label={
                  activeMeal === "breakfast"
                    ? "صبحانه"
                    : activeMeal === "lunch"
                      ? "ناهار"
                      : "شام"
                }
                meal={
                  data?.success
                    ? data.data.days
                        ?.find((item) => item.day === index + 1)
                        ?.meals?.find((meal) => meal.key === activeMeal)
                    : undefined
                }
              />
            ))}
          </div>
        </ScrollFade>
      </div>
      <MealReplacement
        open={replacementOpen}
        onOpenChange={setReplacementOpen}
        meal={activeMeal}
      />
    </PlaygroundFlowContainer>
  );
};

export default WeeklyDietPlanningPage;
