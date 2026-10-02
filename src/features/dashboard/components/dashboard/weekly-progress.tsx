import { memo } from "react";
import { PiCheckFatFill } from "react-icons/pi";

const dayStatus = [
  { day: "ش", status: "completed" },
  { day: "ی", status: "completed" },
  { day: "د", status: "completed" },
  { day: "س", status: "in-progress" },
  { day: "چ", status: "pending" },
  { day: "پ", status: "pending" },
  { day: "ج", status: "pending" },
];

const WeeklyProgress = () => {
  return (
    <div
      className="w-full
                     bg-blue-200 dark:bg-[linear-gradient(to_top,#1A272F_0%,#171F25_55%,#151D23_100%)] shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                     rounded-2xl p-5
                     flex flex-col items-center gap-4
                  "
    >
      <div className="w-full flex flex-col items-start gap-1.5">
        <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          سلام پارسا 👋
        </h2>
        <p className="font-peyda font-medium leading-[140%] text-justify text-blue-900 dark:text-blue-300 compact:text-sm fold:text-base laptop:text-lg">
          با انتخاب های درست میتونی در مسیر تعادل قرار بگیری. تمرکز بر
          کربوهیدرات‌های پیچیده بومی دیم و حبوبات پرپروتئین با کمترین ردپای کربن
          صنعتی.
        </p>
      </div>
      <div className="w-full grid grid-cols-7 items-center place-items-center">
        {dayStatus.map((dayStatus, index) => (
          <div className="w-full flex flex-col items-center gap-1">
            <div
              key={index}
              className={`
                            relative
                            compact:size-8
                            fold:size-9
                            laptop:size-10
                            border
                            rounded-full
                            p-2
                            flex
                            justify-center
                            items-center
                            transition-[background-color,border-color]
                            duration-500
            ${
              dayStatus.status === "completed"
                ? "bg-blue-300 dark:bg-[#1B332D] border-green-700 dark:border-green-950"
                : "bg-blue-300 dark:bg-darker-blue-200 border-blue-300 dark:border-dark"
            }
          `}
            >
              {dayStatus.status === "in-progress" && (
                <div
                  className="
                            absolute
                            inset-0
                            origin-center
                            rounded-full
                            border
                            border-blue-600 dark:border-blue-900
                            pointer-events-none
                            will-change-[transform,opacity]
                        "
                />
              )}
              {dayStatus.status === "completed" ? (
                <div
                  key="completed"
                  className="
                            absolute
                            flex
                            justify-center
                            items-center
                        "
                >
                  <PiCheckFatFill
                    className="
                                text-green-600 dark:text-green-400
                                compact:text-xl
                                fold:text-2xl
                                laptop:text-3xl
                            "
                  />
                </div>
              ) : (
                <div
                  className={`
                                absolute
                                compact:size-3
                                fold:size-4
                                border
                                border-blue-500 dark:border-blue-900
                                rounded-full
                                transition-[background-color,box-shadow]
                                duration-500
                  ${
                    dayStatus.status === "in-progress"
                      ? `
                        bg-blue-400
                        shadow-[0_0_10.7px_0_rgba(117,213,230,0.4)]
                      `
                      : "bg-transparent"
                  }
                `}
                />
              )}
            </div>
            <label className="font-peyda font-medium leading-[140%] compact:text-base fold:text-lg laptop:text-xl">
              {dayStatus.day}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(WeeklyProgress);
