import type { FoodGroup, ParametersType } from "../../api/food-group.types";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Button from "@/shared/base-components/button";
import { memo } from "react";
import { PiPencilSimpleBold } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import { getDisplayQuantity } from "@/shared/lib/utils";

type FoodGroupItemProps = {
  foodGroup: FoodGroup;
  itemIndex: number | -1;
  value?: number;
  handleAddFoodGroup: (
    foodGroupId: number,
    imageUrl: string,
    title: string,
    value: number,
    unit: string,
    cost: ParametersType,
  ) => void;
  handleOpenFoodGroupQuantityDrawer: (
    foodGroupId: number,
    imageUrl: string,
    title: string,
    unit: string,
    cost: ParametersType,
  ) => void;
};

const FoodGroupItem = ({
  foodGroup,
  itemIndex,
  value,
  handleAddFoodGroup,
  handleOpenFoodGroupQuantityDrawer,
}: FoodGroupItemProps) => {
  const displayQuantity = getDisplayQuantity(value, foodGroup.properties.unit);

  return (
    <div className="w-full h-auto bg-darker-blue-300 border border-dark rounded-2xl flex flex-col items-center">
      <div
        className={`w-full bg-darker-blue-400 ${itemIndex !== -1 && "ring-1 ring-inset ring-green-900"} rounded-2xl px-3 py-1 flex flex-row justify-start items-center gap-2`}
      >
        <ImageWithSkeleton
          src={foodGroup.properties.imageUrl}
          alt={foodGroup.title}
          wrapperClassName="compact:size-12 fold:size-13 laptop:size-14"
          className="w-full h-full object-contain pointer-events-none"
        />
        <h3 className="flex-1 min-w-0 compact:text-sm fold:text-base laptop:text-lg font-peyda text-white font-bold">
          {foodGroup.title}
        </h3>
        <AnimatePresence mode="wait" initial={false}>
          {itemIndex !== -1 ? (
            <motion.div
              key="counter"
              initial={{
                opacity: 0,
                scale: 0.85,
                x: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                x: -10,
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex flex-row items-center gap-3"
            >
              <div className="flex flex-row items-center gap-0.5">
                <label className="font-rokh compact:text-2xl fold:text-3xl laptop:text-4xl text-green-400 mt-1">
                  {displayQuantity.value}
                </label>
                <small className="text-white font-peyda compact:text-xs fold:text-sm laptop:text-base">
                  {displayQuantity.unit}
                </small>
              </div>
              <Button
                classes="btn btn-outline-green compact:size-7! fold:size-8! laptop:size-9! rounded-xxs!"
                icon={
                  <PiPencilSimpleBold
                    className="compact:text-xl fold:text-2xl laptop:text-3xl"
                    strokeWidth={2}
                  />
                }
                onClick={() =>
                  handleOpenFoodGroupQuantityDrawer(
                    foodGroup.id,
                    foodGroup.properties.imageUrl,
                    foodGroup.title,
                    foodGroup.properties.unit,
                    foodGroup.properties.cost,
                  )
                }
              />
            </motion.div>
          ) : (
            <motion.div
              key="button"
              initial={{
                opacity: 0,
                scale: 0.85,
                x: -10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                x: 10,
              }}
              transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Button
                classes="btn btn-primary-green compact:size-7! fold:size-8! laptop:size-9! rounded-xxs!"
                icon={
                  <HiOutlineShoppingBag
                    className="compact:text-xl fold:text-2xl laptop:text-3xl"
                    strokeWidth={2}
                  />
                }
                onClick={() =>
                  handleAddFoodGroup(
                    foodGroup.id,
                    foodGroup.properties.imageUrl,
                    foodGroup.title,
                    foodGroup.properties.unit === "گرم"
                      ? 50
                      : foodGroup.properties.unit === "عدد" ||
                          foodGroup.properties.unit === "لیتر"
                        ? 1
                        : 0,
                    foodGroup.properties.unit,
                    foodGroup.properties.cost,
                  )
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* <AnimatePresence initial={false}>
        {name === "limited-shopping" && itemIndex !== -1 && (
          <motion.ul
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="w-full px-6 py-1 grid grid-cols-4 items-center compact:gap-3 mobile:gap-9 mobile-lg:gap-11 fold:gap-20 tablet:gap-12 laptop:gap-8 overflow-hidden"
          >
            <li className="w-full flex flex-row justify-between items-center">
              <div className="bg-[#FFB7BC] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                <PiHeartbeat className="compact:text-lg fold:text-xl laptop:text-2xl" />
              </div>
              <span className="font-rokh text-green-500 compact:text-lg fold:text-xl laptop:text-2xl pt-2">
                {foodGroup.properties.cost.health}+
              </span>
            </li>

            <li className="w-full flex flex-row justify-between items-center">
              <div className="bg-[#FCECAD] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                <PiCoins className="compact:text-lg fold:text-xl laptop:text-2xl" />
              </div>
              <span className="font-rokh text-red-300 compact:text-lg fold:text-xl laptop:text-2xl pt-2">
                {foodGroup.properties.cost.price}-
              </span>
            </li>

            <li className="w-full flex flex-row justify-between items-center">
              <div className="bg-[#C8E0FF] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                <PiAlarm className="compact:text-lg fold:text-xl laptop:text-2xl" />
              </div>
              <span className="font-rokh text-red-300 compact:text-lg fold:text-xl laptop:text-2xl pt-2">
                {foodGroup.properties.cost.available}-
              </span>
            </li>

            <li className="w-full flex flex-row justify-between items-center">
              <div className="bg-[#AAFFC9] rounded-full compact:p-0.5 mobile:p-1 laptop:p-1.5">
                <PiPlant className="compact:text-lg fold:text-xl laptop:text-2xl" />
              </div>
              <span className="font-rokh text-red-300 compact:text-lg fold:text-xl laptop:text-2xl pt-2">
                {foodGroup.properties.cost.environment}-
              </span>
            </li>
          </motion.ul>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default memo(FoodGroupItem);
