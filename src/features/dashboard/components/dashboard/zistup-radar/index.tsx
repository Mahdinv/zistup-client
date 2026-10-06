import { memo } from "react";

const ZistupRadar = () => {
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
                  flex flex-row justify-between items-start
                "
      >
        <h2 className="flex-1 font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
          رادار زیستاپ
        </h2>

        <div className="flex flex-col items-end gap-1">
          <div className="flex flex-row justify-between items-center gap-1">
            <label className="text-blue-400 font-peyda font-bold compact:text-xs fold:text-base laptop:text-lg">
              الگوی کنونی
            </label>
            <div className="bg-blue-400 compact:size-2 fold:size-3 laptop:size-4 rounded-full"></div>
          </div>
          <div className="flex flex-row justify-between items-center gap-1">
            <label className="font-peyda font-bold compact:text-xs fold:text-base laptop:text-lg">
              توازن بهینه
            </label>
            <div className="bg-transparent border border-dashed border-black compact:size-2 fold:size-3 laptop:size-4 rounded-full"></div>
          </div>
        </div>
      </div>
      {/*Radar Chart */}
    </div>
  );
};

export default memo(ZistupRadar);
