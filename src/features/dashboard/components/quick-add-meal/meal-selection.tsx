import { MEALS } from "./quick-add-meal.data";
import type { MealId } from "./quick-add-meal.types";
export default function MealSelection({
  onSelect,
}: {
  onSelect: (meal: MealId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {MEALS.map((meal) => (
        <button
          key={meal.id}
          type="button"
          onClick={() => onSelect(meal.id)}
          className="relative min-h-28 fold:min-h-36 overflow-hidden rounded-lg border border-blue-500 bg-blue-200 text-right shadow-sm dark:border-dark dark:bg-darker-blue-300 focus-visible:outline-2 focus-visible:outline-blue-400 hover:border-blue-800"
        >
          <span className="absolute top-2 right-2 z-10 font-bold text-lg">
            {meal.title}
          </span>
          <img
            src={meal.image}
            alt=""
            className="pointer-events-none absolute -bottom-5 -left-4 h-[115%] w-[85%] max-w-none object-contain object-left-bottom"
          />
        </button>
      ))}
    </div>
  );
}
