import { memo } from "react";
import type { DietResponse } from "../../api/types/diet-response.types";

const CurrentDiet = ({
  diet,
  title,
}: {
  diet?: DietResponse["diet"];
  title?: string;
}) => {
  const isZistup = diet?.key === "zistpa";
  return (
    <div
      className="w-full
                     bg-blue-200 dark:bg-[linear-gradient(to_top,#1A272F_0%,#171F25_55%,#151D23_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                     rounded-2xl p-5
                     flex flex-col items-start gap-2
                  "
    >
      <h1 className="font-yekan font-extrabold compact:text-xl mobile:text-2xl fold:text-3xl laptop:text-4xl">
        رژیم فعال:{" "}
        <span
          className={isZistup ? "dark:text-green-400" : "dark:text-blue-400"}
        >
          {title || "—"}
        </span>
      </h1>
      <p className="font-peyda font-medium text-justify compact:text-xs mobile:text-sm fold:text-base laptop:text-lg">
        {isZistup
          ? "برنامه‌ت بر اساس آنالیز اختصاصی بدنته. برای مشاهده چالش‌ها، بازی‌ها و ویرایش مسیر روی کارت زیر بزن."
          : diet
            ? "در حال حاضر روی رژیم آماده هستی. می‌تونی برنامه‌ت رو تغییر بدی یا به رژیم هوشمند زیستاپ سوئیچ کنی."
            : "اطلاعات رژیم فعال هنوز در دسترس نیست."}
      </p>
    </div>
  );
};

export default memo(CurrentDiet);
