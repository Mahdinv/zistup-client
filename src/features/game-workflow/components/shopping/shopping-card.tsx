import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/base-components/drawer";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { PiTrash, PiXCircle } from "react-icons/pi";

interface ShoppingCardProps {
  name: "free-shopping" | "limited-shopping";
  open: boolean;
  shoppingItems: {
    foodGroupId: number;
    imageUrl: string;
    title: string;
    value: number;
  }[];
  onOpenChange: (open: boolean) => void;
  removeHandle: (index: number) => void;
}

export default function ShoppingCard({
  // name,
  open,
  shoppingItems,
  onOpenChange,
  removeHandle,
}: ShoppingCardProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} swipeDirection="down">
      <DrawerContent
        dir="rtl"
        className="
          mx-auto
          h-[70dvh]
          max-h-180
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
        <DrawerTitle className="sr-only">سبد خرید من</DrawerTitle>

        <DrawerDescription className="sr-only">
          لیست اقلام موجود در سبد خرید
        </DrawerDescription>

        {/* Drag Handle */}
        <div className="flex h-5 shrink-0 items-center justify-center">
          <div className="h-1 w-16 rounded-full bg-darker-blue-200" />
        </div>

        {/* Header */}
        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-darker-blue-100
            px-5
            py-1
            select-none
          "
        >
          <div className="flex items-center gap-2">
            <HiOutlineShoppingBag
              className="text-green-400 compact:text-4xl fold:text-5xl laptop:text-6xl"
              strokeWidth={2}
            />

            <span className="compact:text-lg fold:text-xl laptop:text-2xl font-bold select-none">
              سبد خرید من
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
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
            "
          >
            <PiXCircle className="text-blue-900 hover:text-darker-blue-100 active:text-darker-blue-100 compact:text-5xl fold:text-6xl laptop:text-7xl cursor-pointer" />
          </button>
        </header>

        {/* Items */}
        <ScrollFade>
          <ul className="flex-1 min-h-0 px-5 pt-3 flex flex-col items-center gap-2">
            {(shoppingItems || []).map((item, index) => (
              <li className="w-full bg-darker-blue-400 rounded-2xl px-3 py-0.5 flex flex-row items-center justify-start gap-2">
                <img
                  src={item.imageUrl}
                  className="compact:size-12 fold:size-13 laptop:size-14 object-contain pointer-events-none select-none"
                  loading="lazy"
                  alt={item.imageUrl}
                />
                <h3 className="flex-1 min-w-0 compact:text-sm fold:text-base laptop:text-lg font-peyda text-white font-bold select-none">
                  {item.title}
                </h3>
                <label className="compact:text-xs fold:text-sm laptop:text-base font-peyda text-white font-medium select-none">
                  <span className="compact:text-xl fold:text-2xl laptop:text-3xl font-rokh text-green-400 ml-1">
                    {item.value}
                  </span>
                  کیلو
                </label>
                <PiTrash
                  className="compact:text-xl fold:text-2xl laptop:text-3xl text-red-200 cursor-pointer"
                  onClick={() => {
                    // if (prevItems?.current) {
                    //   delete prevItems.current[item.foodGroupId];
                    // }
                    removeHandle(index);
                  }}
                />
              </li>
            ))}
          </ul>
        </ScrollFade>

        {/* Footer */}
        <footer className="shrink-0 mt-auto px-3 pt-3 pb-5">
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
        </footer>
      </DrawerContent>
    </Drawer>
  );
}
