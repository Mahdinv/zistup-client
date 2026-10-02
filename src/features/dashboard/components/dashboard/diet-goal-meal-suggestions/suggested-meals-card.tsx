import { memo } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import { PiFireSimpleFill } from "react-icons/pi";

type SuggestedMealsCardProps = {
  item: { id: number; type: string; title: string; callory: number };
};

const SuggestedMealsCard = ({ item }: SuggestedMealsCardProps) => {
  return (
    <article
      className="
                    w-full min-w-0 max-w-full
                    bg-blue-300 dark:bg-[#21262D]
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-2xl p-4 cursor-grab
                    flex flex-col items-start gap-4
                "
    >
      <div className="w-full flex flex-row justify-between items-start">
        <label className="bg-transparent border border-yellow-500 text-yellow-500 rounded-lg py-0.5 px-3 font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
          {item.type}
        </label>
        <div className="compact:size-8 fold:size-9 laptop:size-10 rounded-full bg-green-400 hover:bg-green-500 active:bg-green-500 cursor-pointer flex justify-center items-center">
          <LuArrowUpLeft
            className="text-darker-blue-300 compact:text-2xl fold:text-3xl laptop:text-4xl"
            strokeWidth={2.5}
          />
        </div>
      </div>
      <h1 className="w-full min-w-0 wrap-anywhere font-peyda font-bold leading-[145%] compact:text-xl fold:text-2xl laptop:text-3xl">
        {item.title}
      </h1>
      <div
        className="w-full
                   bg-[#0D321E] dark:bg-darker-blue-500
                    text-white
                    rounded-xl py-1 px-3
                    flex flex-row justify-between items-center"
      >
        <div className="flex flex-row items-center gap-1">
          <PiFireSimpleFill className="text-orange-300 compact:text-base fold:text-lg laptop:text-xl" />
          <label className="font-peyda font-medium compact:text-base fold:text-lg laptop:text-xl">
            کالری:
          </label>
        </div>
        <div className="flex-1 justify-end flex flex-row items-center gap-0.5">
          <small className="font-yekan font-normal leading-[120%] compact:text-sm fold:text-base laptop:text-lg">
            kcal
          </small>
          <label className="font-rokh font-semibold leading-[150%] compact:text-2xl fold:text-3xl laptop:text-4xl pt-1">
            {item.callory}
          </label>
        </div>
      </div>
    </article>
  );
};

export default memo(SuggestedMealsCard);
