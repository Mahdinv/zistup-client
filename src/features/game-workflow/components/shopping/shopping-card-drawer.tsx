import BaseDrawer from "@/shared/base-components/base-drawer";
import { getDisplayQuantity } from "@/shared/lib/utils";
import { forwardRef } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiTrash } from "react-icons/pi";

interface ShoppingCardDrawerProps {
  name: "free-shopping" | "limited-shopping";
  open: boolean;
  shoppingItems: {
    foodGroupId: number;
    imageUrl: string;
    title: string;
    value: number;
    unit: string;
  }[];
  onOpenChange: (open: boolean) => void;
  removeHandle: (index: number) => void;
}

const ShoppingCardDrawer = forwardRef<
  Record<number, number>,
  ShoppingCardDrawerProps
>(function ShoppingCard(
  { name, open, shoppingItems, onOpenChange, removeHandle },
  ref,
) {
  if ((name === "limited-shopping" && !ref) || typeof ref === "function") {
    return null;
  }

  const prevItems = ref;

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="سبد خرید من"
      description="لیست اقلام موجود در سبد خرید"
      theme="dark"
      className="h-[70dvh] max-h-180 max-w-107.5 tablet:w-full desktop:w-full border-white/10 bg-darker-blue-300 dark:bg-darker-blue-300"
      header={
        <div className="flex items-center gap-2">
          <HiOutlineShoppingBag
            className="text-green-400 compact:text-4xl fold:text-5xl laptop:text-6xl"
            strokeWidth={2}
          />
          <span className="compact:text-lg fold:text-xl laptop:text-2xl font-bold select-none">
            سبد خرید من
          </span>
        </div>
      }
      footer={
        <div className="bg-darker-blue-200 text-sm py-2">
          <div className="w-full flex flex-row justify-around items-center gap-2 select-none">
            <span className="font-bold compact:text-base fold:text-lg laptop:text-xl">
              مجموع اقلام
            </span>

            <span className="font-bold compact:text-base fold:text-lg laptop:text-xl">
              <span className="font-rokh underline underline-offset-2 decoration-2 ml-1">
                {shoppingItems.length}
              </span>
              مورد انتخاب شده
            </span>
          </div>
        </div>
      }
    >
      <ul className="flex min-h-0 flex-col items-center gap-2">
        {shoppingItems.map((item, index) => {
          const displayQuantity = getDisplayQuantity(item.value, item.unit);
          return (
            <li
              key={item.foodGroupId}
              className="w-full bg-darker-blue-400 rounded-2xl px-3 py-0.5 flex flex-row items-center justify-start gap-2"
            >
              <img
                src={item.imageUrl}
                className="compact:size-12 fold:size-13 laptop:size-14 object-contain pointer-events-none select-none"
                loading="lazy"
                alt={item.title}
              />

              <h3 className="flex-1 min-w-0 compact:text-sm fold:text-base laptop:text-lg font-peyda text-white font-bold select-none">
                {item.title}
              </h3>

              <label className="compact:text-xs fold:text-sm laptop:text-base font-peyda text-white font-medium select-none">
                <span className="compact:text-xl fold:text-2xl laptop:text-3xl font-rokh text-green-400 ml-1">
                  {displayQuantity.value}
                </span>
                {displayQuantity.unit}
              </label>

              <PiTrash
                className="compact:text-xl fold:text-2xl laptop:text-3xl text-red-200 cursor-pointer"
                onClick={() => {
                  if (prevItems?.current) {
                    delete prevItems.current[item.foodGroupId];
                  }
                  removeHandle(index);
                }}
              />
            </li>
          );
        })}
      </ul>
    </BaseDrawer>
  );
});

export default ShoppingCardDrawer;
