import Button from "@/shared/base-components/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/base-components/drawer";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import QuantityPicker from "@/shared/base-components/quantity-picker";
import { PiXCircle } from "react-icons/pi";
import { useCallback, useState } from "react";

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
            h-[64dvh]
            max-h-120
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

        <div className="w-full px-6 py-4">
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
        </div>

        <footer className="shrink-0 mt-auto px-3 pt-3 pb-5">
          <Button
            type="button"
            classes="btn btn-primary-green"
            title="تایید مقدار"
            disable={isConfirmDisabled}
            onClick={handleConfirm}
          />
        </footer>
      </DrawerContent>
    </Drawer>
  );
};

export default FoodGroupQuantityDrawer;
