import { stepTitles } from "@/shared/lib/step-titles";
import { AnimatePresence, motion } from "framer-motion";
import { memo } from "react";
import { CgClose } from "react-icons/cg";
import { HiMiniChevronLeft } from "react-icons/hi2";

type FoodPlateProps = {
  plateNum: number;
  selectedFoodGroup: {
    foodGroupId?: number;
    priority?: number;
    imageUrl?: string;
  }[];
  handleBackPlate: () => void;
  handleDeleteItem: (foodGroupId: number) => void;
};

const FoodPlate = ({
  plateNum,
  selectedFoodGroup,
  handleBackPlate,
  handleDeleteItem,
}: FoodPlateProps) => {
  return (
    <div className="w-full bg-darker-blue-300 border border-dark rounded-2xl py-3.5 px-5.5 flex flex-col items-center gap-2.5 select-none">
      <div className="w-full flex flex-row justify-start items-center gap-2">
        <h1 className="flex-1 text-white compact:text-base fold:text-lg laptop:text-xl font-medium">
          بشقاب {stepTitles[plateNum - 1]}
        </h1>
        <ol className="flex flex-row-reverse items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const active = index + 1 <= plateNum;
            return (
              <li
                key={index}
                className={`compact:w-4.5 compact:h-3 fold:w-5 fold:h-3.5 laptop:w-5.5 laptop:h-4 rounded-full ${active ? "bg-blue-300" : "bg-darker-blue-200 border border-dark"}`}
              ></li>
            );
          })}
        </ol>
        <div
          className={`
                        ${plateNum > 1 ? "text-blue-600 hover:text-blue-500 active:text-blue-500 cursor-pointer" : "text-blue-900 cursor-not-allowed"} 
                        flex flex-row items-center
                    `}
          onClick={() => plateNum !== 1 && handleBackPlate()}
        >
          <small className="compact:text-xxs fold:text-xs laptop:text-sm font-extrabold">
            قبلی
          </small>
          <HiMiniChevronLeft className="compact:text-xl fold:text-3xl laptop:text-4xl mb-1" />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <ol key={plateNum} className="w-full flex flex-row-reverse gap-2">
          {selectedFoodGroup.map((sfg, index) => {
            return (
              <motion.li
                key={sfg.foodGroupId ?? `empty-${index}`}
                initial={{
                  opacity: 0,
                  y: 15,
                  rotate: -5,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: 15,
                  rotate: -5,
                  scale: 0.9,
                }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.04,
                  ease: "easeOut",
                }}
                className={`
                            relative 
                            flex-1
                            compact:w-16 fold:w-16.5 laptop:w-18 aspect-square 
                            rounded-full 
                            bg-darker-blue-200 
                            ${sfg.foodGroupId === undefined ? "border-2 border-dashed" : "border-2 border-green-800 hover:opacity-50 active:opacity-50"} 
                            border-darker-blue-100 
                            flex items-center justify-center
                            p-0.5
                            select-none
                            touch-manipulation
                            cursor-pointer
                        `}
                onClick={() =>
                  sfg.foodGroupId !== undefined &&
                  handleDeleteItem(sfg.foodGroupId)
                }
              >
                {sfg.foodGroupId === undefined ? (
                  <h2 className="compact:text-4xl fold:text-5xl laptop:text-6xl font-rokh text-darker-blue-100 mt-1.5">
                    {index + 1}
                  </h2>
                ) : (
                  <>
                    <div className="absolute compact:-top-1.5 compact:-right-1.5 mobile-lg:-top-1 mobile-lg:-right-1 fold:top-0 fold:right-0 tablet:-top-1 tablet:-right-1 bg-darker-blue-200 border border-dark rounded-full p-1">
                      <CgClose className="text-white compact:text-sm fold:text-lg tablet:text-base laptop:text-base" />
                    </div>
                    <img
                      src={sfg.imageUrl}
                      className="w-full h-full object-contain pointer-events-none select-none"
                      loading="lazy"
                      alt={sfg.imageUrl}
                    />
                  </>
                )}
              </motion.li>
            );
          })}
        </ol>
      </AnimatePresence>
    </div>
  );
};

export default memo(FoodPlate);
