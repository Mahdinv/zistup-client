import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import { MEALS } from "../../constants/quick-add-meal.constants";
import type { MealId } from "../../api/types/quick-add-meal.types";
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
          className="relative min-h-28 fold:min-h-36 overflow-hidden rounded-lg border border-blue-500 bg-blue-200 text-right shadow-sm dark:border-dark dark:bg-darker-blue-300 focus-visible:outline-2 focus-visible:outline-blue-400 hover:border-blue-800 cursor-pointer"
        >
          <span className="absolute top-4 right-4 z-10 font-bold text-lg">
            {meal.title}
          </span>
          <ImageWithSkeleton
            src={meal.image}
            alt=""
            wrapperClassName="pointer-events-none absolute -bottom-7 -left-7 h-[115%] w-[85%]"
            className="h-full w-full max-w-none object-contain object-bottom-left"
          />
        </button>
      ))}
    </div>
  );
}
