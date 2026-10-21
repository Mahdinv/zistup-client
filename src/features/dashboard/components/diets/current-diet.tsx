import { memo } from "react";

const CurrentDiet = () => {
  return (
    <div
      className="w-full
                     bg-blue-200 dark:bg-[linear-gradient(to_top,#1A272F_0%,#171F25_55%,#151D23_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                     rounded-2xl p-5
                     flex flex-col items-start gap-2
                  "
    >
      <h1 className="font-yekan font-extrabold compact:text-xl mobile:text-2xl fold:text-3xl laptop:text-4xl">
        رژیم فعال: <span className={`dark:text-blue-400`}>مدیترانه‌ای</span>
      </h1>
      <p className="font-peyda font-medium text-justify compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
        در حال حاضر روی رژیم آماده هستی. می‌تونی برنامه‌ت رو تغییر بدی یا به
        رژیم هوشمند زیستاپ سوئیچ کنی.
      </p>
    </div>
  );
};

export default memo(CurrentDiet);
