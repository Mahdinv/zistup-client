import { memo, useState } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import PhysicalActivityCard from "./physical-activity-card";
import PhysicalActivityDrawer from "./physical-activity-drawer";
import ScrollFade from "@/shared/base-components/scroll-fade";
import type {
  LoggedPhysicalActivity,
  PhysicalActivitySubmission,
} from "../../../api/types/exercise.types";

const DailyPhysicalActivity = () => {
  const [activities, setActivities] = useState<LoggedPhysicalActivity[]>([]);
  const [open, setOpen] = useState(false);
  const startActivity = () => {
    setOpen(true);
  };
  const submitActivity = (submission: PhysicalActivitySubmission) => {
    // Replace this local update with the registration mutation when its API is available.
    setActivities((current) => [
      ...current,
      { ...submission, localId: crypto.randomUUID() },
    ]);
  };
  return (
    <div className="w-full bg-blue-100 dark:bg-darker-blue-400 border border-gray-100 dark:border-dark rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] flex flex-col justify-center items-start gap-4">
      <div className="w-full compact:min-h-6 fold:min-h-8 laptop:min-h-10 flex flex-row justify-between items-center gap-2">
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          تحرک بدنی امروز شما
        </h2>
        {activities.length > 0 && (
          <button
            type="button"
            onClick={startActivity}
            className="text-orange-200 hover:text-orange-300 active:text-orange-300 flex flex-row items-center gap-1 cursor-pointer"
          >
            <span className="font-peyda font-bold compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
              ثبت فعالیت جدید
            </span>
            <LuArrowUpLeft
              aria-hidden
              className="compact:text-2xl fold:text-3xl laptop:text-4xl"
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>
      {activities.length === 0 ? (
        <div className="w-full bg-transparent border-2 border-dashed border-gray-200 dark:border-darker-blue-100 rounded-xs p-8 flex justify-center items-center">
          <button
            type="button"
            onClick={startActivity}
            className="text-orange-200 hover:text-orange-300 active:text-orange-300 flex flex-row items-center gap-1 cursor-pointer"
          >
            <span className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
              ثبت فعالیت امروز
            </span>
            <LuArrowUpLeft
              aria-hidden
              className="compact:text-2xl fold:text-3xl laptop:text-4xl"
              strokeWidth={2.5}
            />
          </button>
        </div>
      ) : (
        <ScrollFade
          wrapperClassName="h-auto [--scroll-fade-color:var(--color-blue-100)] dark:[--scroll-fade-color:var(--color-darker-blue-400)]"
          className="compact:max-h-60.75 laptop:max-h-60"
        >
          <ol className="w-full flex flex-col items-center gap-2">
            {activities.map((activity) => (
              <PhysicalActivityCard
                key={activity.localId}
                activity={activity}
                onRemove={() =>
                  setActivities((current) =>
                    current.filter((item) => item.localId !== activity.localId),
                  )
                }
              />
            ))}
          </ol>
        </ScrollFade>
      )}
      <PhysicalActivityDrawer
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={submitActivity}
      />
    </div>
  );
};

export default memo(DailyPhysicalActivity);
