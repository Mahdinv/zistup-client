import { memo } from "react";

const FoodFrequencyHelpBar = () => {
  return (
    <div className="w-full flex flex-row justify-around items-center py-2 px-2">
      <div className="w-full border-e border-[#5F5F5F24]">
        <div className="flex flex-col items-center justify-center compact:gap-2 fold:gap-2 w-auto mx-auto py-1 compact:px-1 fold:px-2 tablet:px-4">
          <label className="text-blue-800 text-xs font-peyda font-medium">
            1 الی 2 بار
          </label>
          <div className="flex flex-row items-center compact:gap-1 mobile-lg:gap-1">
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="w-full border-e border-[#5F5F5F24]">
        <div className="flex flex-col items-center justify-center compact:gap-2 fold:gap-2 w-auto mx-auto py-1 compact:px-1 fold:px-2 tablet:px-4">
          <label className="text-blue-800 text-xs font-peyda font-medium">
            3 الی 4 بار
          </label>
          <div className="flex flex-row items-center compact:gap-1 mobile-lg:gap-1">
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full border-e border-[#5F5F5F24]">
        <div className="flex flex-col items-center justify-center compact:gap-2 fold:gap-2 w-auto mx-auto py-1 compact:px-1 fold:px-2 tablet:px-4">
          <label className="text-blue-800 text-xs font-peyda font-medium">
            5 الی 6 بار
          </label>
          <div className="flex flex-row items-center compact:gap-1 mobile-lg:gap-1">
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col items-center justify-center compact:gap-2 fold:gap-2 w-auto mx-auto py-1 compact:px-1 fold:px-2 tablet:px-4">
          <label className="text-blue-800 text-xs font-peyda font-medium">
            بیشتر از 7 بار
          </label>
          <div className="flex flex-row items-center compact:gap-1 mobile-lg:gap-1">
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
            <div className="compact:w-3 mobile-lg:w-4 fold:w-5 aspect-square bg-orange-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FoodFrequencyHelpBar);
