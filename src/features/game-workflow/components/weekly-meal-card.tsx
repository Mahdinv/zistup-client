import { PiArrowsClockwise, PiBowlSteam, PiFadersFill } from "react-icons/pi";
import type { DietMealDto } from "@/features/dashboard/api/dto/diet-day.dto";
import Button from "@/shared/base-components/button";

const number = (value?: number) =>
  typeof value === "number" && Number.isFinite(value)
    ? Math.round(value).toLocaleString("fa-IR", { useGrouping: false })
    : "—";

export default function WeeklyMealCard({
  day,
  label,
  meal,
}: {
  day: string;
  label: string;
  meal?: DietMealDto;
}) {
  const food = meal?.main;
  const companions = (meal?.companions ?? []).filter(
    (item, index, items) =>
      item &&
      items.findIndex(
        (other) =>
          (other?.foodId ?? other?.id ?? other?.title) ===
          (item.foodId ?? item.id ?? item.title),
      ) === index,
  );

  return (
    <article
      dir="rtl"
      className="flex w-full min-w-0 flex-col gap-3 rounded-[20px] border border-[#292F37] bg-[#1C2026] p-4 font-peyda text-[13px] font-bold text-white mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-[#292F37] pb-[0.857em]">
        <h3 className="flex flex-wrap items-baseline gap-[0.571em] text-[1.143em]">
          {day}
          <span className="text-[0.75em] text-[#527B88]">({label})</span>
        </h3>
        <div dir="ltr" className="flex items-center gap-[0.571em] leading-none">
          <span className="translate-y-[0.08em] font-rokh text-[1.714em] text-[#FFA044]">
            {number(food?.nutrition?.calories_kcal)}
          </span>
          <span className="text-[0.786em]">kcal</span>
        </div>
      </header>
      <div className="flex items-center gap-[0.857em]">
        <div className="flex size-[3.429em] shrink-0 items-center justify-center overflow-hidden rounded-[0.714em] bg-[#DDF1F9] text-black">
          {food?.image_url ? (
            <img
              src={food.image_url}
              alt={food.title ?? ""}
              loading="lazy"
              className="size-full object-cover"
            />
          ) : (
            <PiBowlSteam aria-hidden="true" className="size-[2.571em]" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-[1.143em] leading-[1.5] break-words">
            {food?.title ?? "غذایی ثبت نشده"}
          </h4>
          <p className="text-[0.786em] text-[#527B88]">
            حجم:{" "}
            <span className="inline-block translate-y-[0.08em] leading-none">
              {number(food?.quantity?.servings)}
            </span>{" "}
            {food?.quantity?.unit ?? "وعده"} (
            <span className="inline-block translate-y-[0.08em] leading-none">
              {number(food?.quantity?.grams)}
            </span>{" "}
            گرم)
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[0.571em]">
        {[
          {
            label: "P",
            value: food?.nutrition?.protein_g,
            color: "text-[#FF7075]",
          },
          {
            label: "Fi",
            value: food?.nutrition?.fiber_g,
            color: "text-[#21DF84]",
          },
          {
            label: "Car",
            value: food?.nutrition?.carbohydrate_g,
            color: "text-[#FFA044]",
          },
        ].map((item) => (
          <div
            key={item.label}
            dir="ltr"
            className="flex min-w-0 items-center justify-between gap-[0.429em] rounded-[0.357em] border border-[#292F37] bg-[#21262D] px-[calc(0.286em+2px)] py-[0.5em] font-yekan leading-none laptop:justify-center laptop:gap-8 laptop:px-[0.286em]"
          >
            <span
              className={`translate-y-[0.08em] text-[0.786em] ${item.color}`}
            >
              {item.label}
            </span>
            <span className="flex min-w-0 items-center gap-[0.286em]">
              <span className="translate-y-[0.08em] text-[1em] tabular-nums">
                {number(item.value)}
              </span>
              <span className="translate-y-[0.08em] text-[0.714em] text-[#527B88]">
                g
              </span>
            </span>
          </div>
        ))}
      </div>
      {companions.length > 0 && (
        <div className="w-full flex flex-col items-center gap-1">
          <label className="font-peyda compact:text-[13px] mobile:text-base fold:text-lg laptop:text-xl self-start text-green-500 mt-1">
            همراه با:
          </label>
          {companions.map((item, index) => (
            <div
              key={item.id ?? index}
              className="w-full flex items-center justify-between gap-[0.571em] rounded-[0.714em] border border-[#292F37] bg-[#0D0E10] px-[0.714em] py-[0.571em]"
            >
              <p className="min-w-0 text-[0.786em] leading-[1.6]">
                {item.title ?? "—"}{" "}
                <span className="text-[#527B88]">
                  (
                  <span className="inline-block translate-y-[0.08em] leading-none">
                    {number(item.quantity?.servings)}
                  </span>{" "}
                  {item.quantity?.unit ?? "وعده"}،{" "}
                  <span className="inline-block translate-y-[0.08em] leading-none">
                    {number(item.quantity?.grams)}
                  </span>{" "}
                  گرم)
                </span>
              </p>
              <div
                dir="ltr"
                className="flex shrink-0 items-center gap-[0.571em] leading-none"
              >
                <span className="translate-y-[0.08em] font-rokh text-[1.714em] text-[#FFA044] mt-1">
                  {number(item.nutrition?.calories_kcal)}
                </span>
                <span className="text-[0.786em] mt-2">kcal</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-[0.571em] mt-1">
        <Button
          classes="btn btn-primary-green min-w-0 flex-1 rounded-[0.714em]! compact:text-[13px]! mobile:text-[14px]! fold:text-[16px]! laptop:text-[18px]! [&>div]:gap-[0.857em]!"
          title="جایگزین کردن"
          icon={
            <PiArrowsClockwise aria-hidden="true" className="size-[1.714em]" />
          }
          itemsGap={12}
          iconFirst
        />
        <button
          type="button"
          aria-disabled="true"
          aria-label={`تنظیمات وعده ${day}`}
          className="flex shrink-0 items-center justify-center rounded-[0.714em] bg-[#304B54] px-[0.857em] text-[#70D9F3]"
        >
          <PiFadersFill aria-hidden="true" className="size-[1.714em]" />
        </button>
      </div>
    </article>
  );
}
