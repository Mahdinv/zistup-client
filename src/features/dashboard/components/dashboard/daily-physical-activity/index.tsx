import { memo } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import PhysicalActivityCard from "./physical-activity-card";
import ScrollFade from "@/shared/base-components/scroll-fade";

const DailyPhysicalActivity = () => {
  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-start gap-4
                "
    >
      <div
        className="
          w-full
          compact:min-h-6 fold:min-h-8 laptop:min-h-10
          flex flex-row justify-between items-center
        "
      >
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          تحرک بدنی امروز شما
        </h2>

        <div className="text-orange-200 hover:text-orange-300 active:text-orange-300 flex flex-row items-center gap-1 cursor-pointer">
          <h3 className="font-peyda font-bold compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
            ثبت فعالیت جدید
          </h3>
          <LuArrowUpLeft
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={2.5}
          />
        </div>
      </div>
      {/* <div className="w-full bg-transparent border-2 border-dashed border-gray-200 dark:border-darker-blue-100 rounded-xs p-8 flex justify-center items-center">
        <div className="text-orange-200 hover:text-orange-300 active:text-orange-300 flex flex-row items-center gap-1 cursor-pointer">
          <h3 className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
            ثبت فعالیت امروز
          </h3>
          <LuArrowUpLeft
            className="compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={2.5}
          />
        </div>
      </div> */}
      <ScrollFade>
        <ol className="w-full flex flex-col items-center gap-2 compact:max-h-60.75 laptop:max-h-60">
          <PhysicalActivityCard />
          <PhysicalActivityCard />
          <PhysicalActivityCard />
          <PhysicalActivityCard />
          <PhysicalActivityCard />
          <PhysicalActivityCard />
        </ol>
      </ScrollFade>
    </div>
  );
};

export default memo(DailyPhysicalActivity);
