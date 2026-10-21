import { memo } from "react";
import { PiXCircle } from "react-icons/pi";

import type { LoggedPhysicalActivity } from "../../../api/types/exercise.types";

const PhysicalActivityCard = ({
  activity,
  onRemove,
}: {
  activity: LoggedPhysicalActivity;
  onRemove: () => void;
}) => {
  return (
    <li
      className="w-full
                    bg-blue-300 dark:bg-[#21262D]
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-xs p-2.5
                    flex flex-row justify-between items-center"
    >
      <div className="min-w-0 flex-1 pl-2 break-words justify-start flex flex-col items-start gap-1">
        <h2 className="font-peyda font-bold compact:text-base fold:text-lg laptop:text-xl">
          {activity.exercise.label}
        </h2>
        <label className="text-blue-800 font-peyda font-medium compact:text-sm fold:text-base laptop:text-lg">
          به مدت {activity.durationMinutes} دقیقه
        </label>
      </div>
      <div className="flex flex-row justify-end items-center gap-1.5">
        <div className="flex-1 justify-end flex flex-row items-center gap-0.5">
          <small className="font-yekan font-extrabold leading-[120%] compact:text-sm fold:text-base laptop:text-lg">
            kcal
          </small>
          <label className="text-orange-200 font-rokh font-semibold leading-[150%] compact:text-5xl fold:text-[28px] laptop:text-6xl pt-1">
            {activity.calories ?? "—"}
          </label>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`حذف ${activity.exercise.label}`}
        >
          <PiXCircle
            aria-hidden
            className="text-blue-900 hover:text-darker-blue-200 active:text-darker-blue-200 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer"
            strokeWidth={1.5}
          />
        </button>
      </div>
    </li>
  );
};

export default memo(PhysicalActivityCard);
