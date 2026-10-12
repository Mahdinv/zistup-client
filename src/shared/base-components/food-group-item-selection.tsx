import { memo } from "react";
import ImageWithSkeleton from "./image-with-skeleton";
import type { ShoppingItem } from "@/features/dashboard/api/types/shopping.types";
import { formatFoodItemQuantity } from "@/shared/lib/quantity.utils";

type FoodGroupItemSelection = {
  item: ShoppingItem;
};

const FoodGroupItemSelection = ({ item }: FoodGroupItemSelection) => {
  const displayQuantity = formatFoodItemQuantity(item.quantityG, item.id);
  const quantityParts = displayQuantity.match(/\d+|\D+/g) ?? [];

  return (
    <div className="w-full h-auto bg-darker-blue-300 border border-dark rounded-2xl flex flex-col items-center">
      <div className="w-full bg-darker-blue-400 rounded-2xl px-3 py-1 flex flex-row justify-start items-center gap-2">
        <ImageWithSkeleton
          src={item.imageUrl}
          alt={item.title}
          wrapperClassName="compact:size-12 fold:size-13 laptop:size-14"
          className="w-full h-full object-contain pointer-events-none"
        />
        <h3 className="flex-1 min-w-0 compact:text-sm fold:text-base laptop:text-lg font-peyda text-white font-bold">
          {item.title}
        </h3>
        <div className="bg-darker-blue-200 text-green-400 rounded-xs px-2 flex flex-row items-center gap-2">
          <span className="compact:text-sm mobile:text-base fold:text-lg laptop:text-xl pt-1">
            {quantityParts.map((part, index) => (
              <span
                key={index}
                className={/^\d+$/.test(part) ? "font-rokh" : "font-peyda"}
              >
                {part}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(FoodGroupItemSelection);
