import useRegisterActivityMutation from "../../../hooks/use-register-activity-mutation.hook";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import useTodayActivitiesQuery from "../../../hooks/use-today-activities-query.hook";

import { memo, useRef, useState } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import PhysicalActivityCard from "./physical-activity-card";
import PhysicalActivityDrawer from "./physical-activity-drawer";
import ScrollFade from "@/shared/base-components/scroll-fade";
import type { PhysicalActivitySubmission } from "../../../api/types/exercise.types";

const DailyPhysicalActivity = () => {
  const registration = useRegisterActivityMutation();
  const submissionInFlight = useRef(false);
  const activitiesQuery = useTodayActivitiesQuery();
  const activities = activitiesQuery.data?.activities ?? [];
  const [open, setOpen] = useState(false);
  const startActivity = () => {
    setOpen(true);
  };
  const submitActivity = async (
    submission: PhysicalActivitySubmission,
  ): Promise<boolean> => {
    if (submissionInFlight.current) return false;
    submissionInFlight.current = true;
    try {
      await registration.mutateAsync({
        exercise_id: submission.exercise.id,
        duration: submission.durationMinutes,
      });
      toast.success("فعالیت با موفقیت ثبت شد");
      return true;
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      return false;
    } finally {
      submissionInFlight.current = false;
    }
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
      {activitiesQuery.isPending ? (
        <div
          role="status"
          aria-label="در حال دریافت فعالیت‌های امروز"
          className="w-full space-y-2"
        >
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="h-20 rounded-xs bg-blue-300 dark:bg-darker-blue-200 animate-pulse motion-reduce:animate-none"
            />
          ))}
        </div>
      ) : activitiesQuery.isError ? (
        <div
          role="alert"
          className="w-full flex flex-col items-center gap-3 text-center"
        >
          <p>{getApiErrorMessage(activitiesQuery.error)}</p>
          <button
            type="button"
            onClick={() => void activitiesQuery.refetch()}
            className="rounded-2xl bg-orange-200 px-4 py-2 font-bold text-darker-green-200 hover:bg-orange-300"
          >
            تلاش مجدد
          </button>
        </div>
      ) : activities.length === 0 ? (
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
              <PhysicalActivityCard key={activity.id} activity={activity} />
            ))}
          </ol>
        </ScrollFade>
      )}
      <PhysicalActivityDrawer
        open={open}
        pending={registration.isPending}
        onClose={() => setOpen(false)}
        onSubmit={submitActivity}
      />
    </div>
  );
};

export default memo(DailyPhysicalActivity);
