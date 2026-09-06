import NumberCounter from "@/shared/base-components/number-counter";
import type { FoodGroup } from "../../api/food-group.types";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Button from "@/shared/base-components/button";
import { memo } from "react";
import type { ShoppingForm } from "../../schemas/shopping.schema";
import { Controller, type Control } from "react-hook-form";
import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";

type FoodGroupItemProps = {
  name: "free-shopping" | "limited-shopping";
  foodGroup: FoodGroup;
  control: Control<ShoppingForm>;
  itemIndex: number | -1;
  handleAddFoodGroup: (
    foodGroupId: number,
    imageUrl: string,
    title: string,
    value: number,
  ) => void;
};

const FoodGroupItem = ({
  name,
  foodGroup,
  control,
  itemIndex,
  handleAddFoodGroup,
}: FoodGroupItemProps) => {
  return (
    <div className="w-full h-auto bg-darker-blue-300 border border-dark rounded-2xl flex flex-col items-center">
      <div
        className={`w-full bg-darker-blue-400 ${itemIndex !== -1 && "ring-1 ring-inset ring-green-900"} rounded-2xl px-3 py-1 flex flex-row justify-start items-center gap-2`}
      >
        <img
          src={foodGroup.properties.imageUrl}
          className="compact:size-12 fold:size-13 laptop:size-14 object-contain pointer-events-none select-none"
          loading="lazy"
          alt={foodGroup.properties.imageUrl}
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
            >
              <Controller
                name={`items.${itemIndex}.value`}
                control={control}
                render={({ field }) => (
                  <NumberCounter
                    min={0}
                    max={500}
                    value={field.value}
                    onChange={field.onChange}
                    suffix={foodGroup.properties.unit}
                    counterClasses="py-0! px-0! rounded-xl compact:gap-0! mobile:gap-1! mobile-lg:gap-2! fold:gap-6!"
                    plusButtonClasses="p-1.5"
                    minusButtonClasses="p-1.5"
                    plusIconClasses="text-lg"
                    minusIconClasses="text-lg"
                    valueClasses="compact:text-2xl! fold:text-3xl! laptop:text-4xl!"
                    suffixClasses="compact:text-sm! fold:text-base! laptop:text-lg! text-white"
                    controlsClasses="pt-0 gap-0.5"
                  />
                )}
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
                classes="btn btn-outline-green compact:size-7! fold:size-8! laptop:size-9! rounded-xxs!"
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
                      ? 200
                      : foodGroup.properties.unit === "عدد"
                        ? 1
                        : 0.5,
                  )
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
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
      </AnimatePresence>
    </div>
  );
};

export default memo(FoodGroupItem);
