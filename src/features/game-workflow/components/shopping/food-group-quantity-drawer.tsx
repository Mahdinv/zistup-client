import Button from "@/shared/base-components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/base-components/drawer";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import {
  PiAlarm,
  PiCoins,
  PiHeartbeat,
  PiPlant,
  PiXCircle,
} from "react-icons/pi";
import { useCallback, useState } from "react";
import type { ParametersType } from "../../api/food-group.types";

type FoodGroupQuantityDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (foodGroupId: number, value: number) => void;
  foodGroupItem: {
    foodGroupId: number;
    imageUrl: string;
    title: string;
    unit: string;
    value: number;
    cost?: ParametersType;
  };
};

const FoodGroupQuantityDrawer = ({
  open,
  onOpenChange,
  onConfirm,
  foodGroupItem,
}: FoodGroupQuantityDrawerProps) => {
  const [draftValue, setDraftValue] = useState<number | null>(null);
  const currentValue = draftValue ?? foodGroupItem.value;
  const isConfirmDisabled = !Number.isFinite(currentValue) || currentValue <= 0;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setDraftValue(null);
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const handleConfirm = useCallback(() => {
    if (currentValue <= 0) return;

    onConfirm(foodGroupItem.foodGroupId, currentValue);
    handleOpenChange(false);
  }, [currentValue, foodGroupItem.foodGroupId, onConfirm, handleOpenChange]);

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} swipeDirection="down">
      <DrawerContent
        dir="rtl"
        className="
            mx-auto
            h-auto
            w-full
            max-w-107.5
            overflow-hidden
            rounded-t-[26px]
            border
            border-white/10
            bg-darker-blue-300
            text-white
          "
      >
        <DrawerTitle className="sr-only">ویرایش مقدار محصول</DrawerTitle>
        <DrawerDescription className="sr-only">
          مقدار محصول انتخابی کاربر
        </DrawerDescription>
        <div className="flex h-5 shrink-0 items-center justify-center">
          <div className="h-1 w-16 rounded-full bg-darker-blue-200" />
        </div>
        <header
          className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              border-darker-blue-100
              px-4
              py-0
              select-none
            "
        >
          <div className="flex items-center gap-2">
            <ImageWithSkeleton
              src={foodGroupItem.imageUrl}
              alt={foodGroupItem.title}
              wrapperClassName="w-16 h-16"
              className="w-full h-full object-contain pointer-events-none"
            />

            <span className="compact:text-xl fold:text-2xl laptop:text-3xl font-extrabold select-none">
              {foodGroupItem.title}
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            aria-label="بستن سبد خرید"
            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[#65a4b1]
                transition
                hover:bg-white/5
                ml-2
              "
          >
            <PiXCircle className="text-blue-900 hover:text-darker-blue-100 active:text-darker-blue-100 compact:text-5xl fold:text-6xl laptop:text-7xl cursor-pointer" />
          </button>
        </header>

        <div className="w-full flex flex-col items-center gap-4 px-6 py-4">
          <QuantityPicker
            value={currentValue}
            onChange={setDraftValue}
            unit={
              foodGroupItem.unit === "کیلو"
                ? "kilogram"
                : foodGroupItem.unit === "گرم"
                  ? "gram"
                  : foodGroupItem.unit === "لیتر"
                    ? "liter"
                    : "number"
            }
          />

          {foodGroupItem.cost && (
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <label className="text-white font-peyda font-bold compact:text-lg fold:text-xl laptop:text-2xl">
                به ازای هر یک کیلو گرم:
              </label>
              <ul className="w-full bg-darker-blue-200 border border-dark rounded-2xl py-2 px-6 flex flex-row justify-around items-center gap-2">
                <li className="w-full flex flex-row justify-center items-center gap-2">
                  <div className="bg-[#FFB7BC] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                    <PiHeartbeat className="text-black compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl" />
                  </div>
                  <span className="font-rokh text-green-500 compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl pt-2">
                    {foodGroupItem.cost.health}+
                  </span>
                </li>
                <li className="w-full flex flex-row justify-center items-center gap-2">
                  <div className="bg-[#FCECAD] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                    <PiCoins className="text-black compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl" />
                  </div>
                  <span className="font-rokh text-red-300 compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl pt-2">
                    {foodGroupItem.cost.price}-
                  </span>
                </li>
                <li className="w-full flex flex-row justify-center items-center gap-2">
                  <div className="bg-[#C8E0FF] rounded-full compact:p-1 mobile:p-1 laptop:p-1.5">
                    <PiAlarm className="text-black compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl" />
                  </div>
                  <span className="font-rokh text-red-300 compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl pt-2">
                    {foodGroupItem.cost.available}-
                  </span>
                </li>
                <li className="w-full flex flex-row justify-center items-center gap-2">
                  <div className="bg-[#AAFFC9] rounded-full compact:p-0.5 mobile:p-1 laptop:p-1.5">
                    <PiPlant className="text-black compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl" />
                  </div>
                  <span className="font-rokh text-red-300 compact:text-sm mobile:text-lg fold:text-xl laptop:text-2xl pt-2">
                    {foodGroupItem.cost.environment}-
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>

        <footer className="shrink-0 mt-auto px-3 pt-3 pb-5">
          <Button
            type="button"
            classes="btn btn-primary-green rounded-xs!"
            title="تأیید مقدار"
            disable={isConfirmDisabled}
            onClick={handleConfirm}
          />
        </footer>
      </DrawerContent>
    </Drawer>
  );
};

export default FoodGroupQuantityDrawer;
