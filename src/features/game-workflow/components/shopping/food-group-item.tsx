import NumberCounter from "@/shared/base-components/number-counter";
import type { FoodGroup } from "../../api/food-group.types";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Button from "@/shared/base-components/button";
import { memo } from "react";
import type { ShoppingForm } from "../../schemas/shopping.schema";
import { Controller, type Control } from "react-hook-form";

type FoodGroupItemProps = {
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
  foodGroup,
  control,
  itemIndex,
  handleAddFoodGroup,
}: FoodGroupItemProps) => {
  return (
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
      {itemIndex !== -1 ? (
        <Controller
          name={`items.${itemIndex}.value`}
          control={control}
          render={({ field }) => (
            <NumberCounter
              min={0}
              max={500}
              value={field.value}
              onChange={field.onChange}
              suffix="سال"
              counterClasses="py-0! px-0! rounded-xl compact:gap-2! fold:gap-3! laptop:gap-4!"
              plusButtonClasses="p-1.5"
              minusButtonClasses="p-1.5"
              plusIconClasses="text-lg"
              minusIconClasses="text-lg"
              valueClasses="text-4xl!"
              suffixClasses="compact:text-sm! fold:text-base! laptop:text-lg! text-white"
              controlsClasses="pt-0 gap-0.5"
            />
          )}
        />
      ) : (
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
              0.5,
            )
          }
        />
      )}
    </div>
  );
};

export default memo(FoodGroupItem);
