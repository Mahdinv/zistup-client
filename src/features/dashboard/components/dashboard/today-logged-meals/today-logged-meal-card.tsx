import { PiXCircle } from "react-icons/pi";
import { memo } from "react";
import type { LoggedMeal } from "../../../api/types/meal-logs.types";
import { loggedMealTags } from "../../../constants/meal-colors.constants";

type Props = {
  item: LoggedMeal;
  onDelete: () => void;
  deleteDisabled: boolean;
  isDeleting: boolean;
};

const TodayLoggedMealCard = ({
  item,
  onDelete,
  deleteDisabled,
  isDeleting,
}: Props) => {
  const tag = loggedMealTags[item.meal];
  return (
    <li className="w-full flex flex-col justify-start items-center gap-1.5">
      <label
        style={{ color: tag.color, borderColor: tag.color }}
        className="w-full border rounded-lg font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg text-center p-1"
      >
        {tag.title}
      </label>
      <div
        className="w-full
                        bg-blue-300 dark:bg-[#21262D]
                        border border-blue-500 dark:border-darker-blue-100
                        rounded-xxs p-2.5
                        flex flex-row justify-between items-center"
      >
        <h2 className="flex-1 font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg text-justify">
          {item.foodName}
        </h2>

        <div className="flex flex-row justify-end items-center gap-1.5">
          <div className="flex-1 justify-end flex flex-row items-center gap-0.5">
            <small className="font-yekan font-extrabold leading-[120%] compact:text-sm fold:text-base laptop:text-lg">
              kcal
            </small>
            <label className="font-rokh font-semibold leading-[150%] compact:text-5xl fold:text-[28px] laptop:text-6xl pt-1">
              {Math.round(item.calories).toLocaleString("fa-IR")}
            </label>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleteDisabled}
            aria-label={"حذف " + item.foodName}
            aria-busy={isDeleting}
            className="disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full"
          >
            <PiXCircle
              aria-hidden="true"
              className="text-blue-600 hover:text-blue-500 active:text-blue-500 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </li>
  );
};

export default memo(TodayLoggedMealCard);
