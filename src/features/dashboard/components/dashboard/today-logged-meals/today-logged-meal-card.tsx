import { memo } from "react";
import { PiXCircle } from "react-icons/pi";

const TodayLoggedMealCard = () => {
  return (
    <li className="w-full flex flex-col justify-start items-center gap-1.5">
      <label className="w-full text-yellow-400 border border-yellow-400 rounded-lg font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg text-center p-1">
        صبحانه
      </label>
      <div
        className="w-full
                        bg-blue-300 dark:bg-[#21262D]
                        border border-blue-500 dark:border-darker-blue-100
                        rounded-xxs p-2.5
                        flex flex-row justify-between items-center"
      >
        <h2 className="flex-1 font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg text-justify">
          خوراک عدسی گرم با سنگک
        </h2>

        <div className="flex flex-row justify-end items-center gap-1.5">
          <div className="flex-1 justify-end flex flex-row items-center gap-0.5">
            <small className="font-yekan font-extrabold leading-[120%] compact:text-sm fold:text-base laptop:text-lg">
              kcal
            </small>
            <label className="font-rokh font-semibold leading-[150%] compact:text-5xl fold:text-[28px] laptop:text-6xl pt-1">
              250
            </label>
          </div>
          <PiXCircle
            className="text-blue-600 hover:text-blue-500 active:text-blue-500 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer"
            strokeWidth={1.5}
          />
        </div>
      </div>
    </li>
  );
};

export default memo(TodayLoggedMealCard);
