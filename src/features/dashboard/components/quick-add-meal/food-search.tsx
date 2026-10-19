import ScrollFade from "@/shared/base-components/scroll-fade";
import { PiMagnifyingGlass, PiMicrophone, PiPlus } from "react-icons/pi";
import { toast } from "sonner";
import type { Food, SearchState } from "./quick-add-meal.types";
export function FoodSearchInput({
  query,
  onChange,
}: {
  query: string;
  onChange: (query: string) => void;
}) {
  return (
    <div className="flex flex-row-reverse gap-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-blue-500 bg-blue-200 px-3 text-blue-900 focus-within:border-blue-900 dark:border-blue-900 dark:bg-darker-blue-400 dark:text-white dark:focus-within:border-blue-400">
        <PiMagnifyingGlass
          aria-hidden
          className="size-6 shrink-0 text-blue-800"
        />
        <input
          aria-label="جستجوی غذا"
          type="search"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder="نام غذا یا خوراکی رو اینجا سرچ کن"
          className="h-12 min-w-0 w-full bg-transparent text-base outline-none placeholder:text-blue-600 dark:placeholder:text-blue-900"
        />
      </div>
      <button
        type="button"
        aria-label="جستجوی صوتی (به‌زودی)"
        onClick={() => toast.info("جستجوی صوتی هنوز فعال نیست")}
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500 bg-blue-200 text-blue-600 dark:border-blue-900 dark:bg-darker-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"
      >
        <PiMicrophone className="size-6" />
      </button>
    </div>
  );
}
export default function FoodSearch({
  state,
  onSelect,
}: {
  state: SearchState;
  onSelect: (food: Food) => void;
}) {
  if (state.status === "results")
    return (
      <ScrollFade
        wrapperClassName="[--result-row:3.75rem] [--result-gap:0.5rem] h-[calc(var(--result-row)*4+var(--result-gap)*3)]"
        className="overscroll-contain"
      >
        <ul aria-label="نتایج جستجوی غذا" className="space-y-(--result-gap)">
          {state.foods.map((food) => (
            <li
              key={food.id}
              className="flex h-(--result-row) items-center gap-2 rounded-3xl bg-darker-blue-200 py-2 pr-3 pl-2 text-white dark:bg-darker-blue-500"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-lg">{food.title}</h3>
                <p className="truncate text-xs text-blue-700">
                  {food.subtitle}
                </p>
              </div>
              <span className="flex flex-row-reverse items-baseline gap-1 text-orange-200">
                <span className="font-rokh text-2xl">
                  {food.nutrition.kcal}
                </span>
                <small className="text-white text-xxs">kcal</small>
              </span>
              <button
                type="button"
                onClick={() => onSelect(food)}
                aria-label={`افزودن ${food.title}`}
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-green-400 text-darker-green-200 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
              >
                <PiPlus className="size-8" />
              </button>
            </li>
          ))}
        </ul>
      </ScrollFade>
    );
  return (
    <div
      role="status"
      className="flex min-h-40 flex-col items-center justify-center gap-2 py-2 text-center"
    >
      {state.status === "idle" ? (
        <>
          <PiMagnifyingGlass aria-hidden className="size-12 text-blue-900" />
          <p>منتظر جستجوی تو هستیم...</p>
          <p className="max-w-52 text-blue-800">
            اسم غذا رو بالا تایپ کن یا با دکمه میکروفون اسمش رو بگو.
          </p>
        </>
      ) : (
        <>
          <img
            src="/pwa/add-meal/food-not-found.webp"
            alt=""
            className="h-20 w-20 object-contain"
          />
          <p>متاسفم، غذایی با این نام پیدا نشد.</p>
          <button
            type="button"
            onClick={() =>
              toast.info("افزودن غذای جدید در نسخه بعدی فعال می‌شود")
            }
            className="flex min-h-11 items-center gap-2 rounded-xl border border-blue-800 px-3 font-bold text-blue-800 dark:border-blue-400 dark:text-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            <PiPlus className="size-6" />
            افزودن غذای جدید
          </button>
        </>
      )}
    </div>
  );
}
