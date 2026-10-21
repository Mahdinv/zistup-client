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
          data-meal={meal.id}
          type="button"
          onClick={() => onSelect(meal.id)}
          className="group/meal relative h-[104px] fold:h-36 overflow-hidden rounded-xs border-[1.5px] border-blue-500 bg-blue-300 text-right shadow-[0_4px_4px_0_#0000000a] dark:shadow-none dark:border-dark dark:bg-darker-blue-300 focus-visible:outline-2 focus-visible:outline-blue-400 hover:border-blue-800 cursor-pointer"
        >
          <span className="absolute top-2.5 right-2.5 z-10 font-bold text-lg">
            {meal.title}
          </span>
          <ImageWithSkeleton
            src={meal.image}
            alt=""
            wrapperClassName="pointer-events-none absolute top-[20.5px] -left-[38.5px] h-[103px] w-[137px] group-data-[meal=breakfast]/meal:top-[19.5px] group-data-[meal=breakfast]/meal:h-[92px] group-data-[meal=breakfast]/meal:w-[130px] group-data-[meal=dinner]/meal:top-[17.5px] group-data-[meal=dinner]/meal:-left-[28.5px] group-data-[meal=dinner]/meal:h-[113px] group-data-[meal=dinner]/meal:w-[135px] group-data-[meal=snack]/meal:-left-[31.5px] group-data-[meal=snack]/meal:h-[109px] group-data-[meal=snack]/meal:w-[126px] fold:scale-125 fold:origin-top-left"
            className="h-full w-full max-w-none object-contain object-bottom-left"
          />
        </button>
      ))}
    </div>
  );
}
