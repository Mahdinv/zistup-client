import { memo } from "react";
import { PiXCircle } from "react-icons/pi";
import Button from "@/shared/base-components/button";

import type { DailyActivity } from "../../../api/types/daily-activities.types";

const PhysicalActivityCard = ({
  activity,
  onRemove,
  deleteDisabled,
  isDeleting,
}: {
  activity: DailyActivity;
  onRemove?: () => void;
  deleteDisabled?: boolean;
  isDeleting?: boolean;
}) => {
  return (
    <li
      className="w-full
                    bg-blue-300 dark:bg-darker-blue-200
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-xs p-2.5
                    flex flex-row justify-between items-center gap-2"
    >
      <div className="min-w-0 flex-1 break-words flex flex-col items-start gap-1">
        <h2 className="font-peyda font-bold compact:text-base/[1.4] fold:text-lg/[1.4] laptop:text-xl/[1.4]">
          {activity.activity}
        </h2>
        <p className="text-blue-800 font-peyda font-medium compact:text-sm/[1.4] fold:text-base/[1.4] laptop:text-lg/[1.4]">
          به مدت {activity.duration} دقیقه
        </p>
      </div>
      <div className="shrink-0 flex flex-row items-center gap-1.5">
        <div
          dir="ltr"
          className="flex flex-row items-baseline gap-1 whitespace-nowrap text-orange-200 mt-2"
        >
          <span className="font-rokh font-extrabold compact:text-5xl/none fold:text-[28px]/none laptop:text-6xl/none">
            {activity.calories ?? "—"}
          </span>
          <small className="font-peyda font-bold compact:text-sm/none fold:text-base/none laptop:text-lg/none">
            kcal
          </small>
        </div>
        {onRemove && (
          <Button
            type="button"
            onClick={onRemove}
            disable={deleteDisabled}
            loading={isDeleting}
            aria-label={`حذف ${activity.activity}`}
            classes="!p-0 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full"
            iconClasses="flex items-center leading-none text-blue-900 hover:text-blue-800 active:text-blue-800 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer"
            icon={<PiXCircle aria-hidden="true" strokeWidth={1.5} />}
          />
        )}
      </div>
    </li>
  );
};

export default memo(PhysicalActivityCard);
