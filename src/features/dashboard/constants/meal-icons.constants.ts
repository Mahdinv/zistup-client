import type { IconType } from "react-icons";
import {
  PiArrowUpLeft,
  PiCaretRight,
  PiFireFill,
  PiMagnifyingGlass,
  PiMicrophone,
  PiPlus,
  PiPlusBold,
  PiXCircle,
} from "react-icons/pi";

export const MEAL_ICONS = {
  close: { icon: PiXCircle, classes: "size-6 text-blue-900" },
  search: { icon: PiMagnifyingGlass, classes: "size-6 text-blue-900" },
  "search-light": { icon: PiMagnifyingGlass, classes: "size-6 text-blue-500" },
  "search-empty": { icon: PiMagnifyingGlass, classes: "size-12 text-blue-900" },
  mic: {
    icon: PiMicrophone,
    classes: "size-6 text-blue-500 dark:text-blue-900",
  },
  plus: { icon: PiPlusBold, classes: "size-[23px] text-darker-green-200" },
  flame: { icon: PiFireFill, classes: "h-5 w-4 text-orange-300" },
  detail: {
    icon: PiArrowUpLeft,
    classes: "size-4 text-blue-800 dark:text-blue-400",
  },
  back: { icon: PiCaretRight, classes: "size-5 text-blue-700" },
  add: { icon: PiPlus, classes: "size-5 text-blue-800 dark:text-blue-400" },
} satisfies Record<string, { icon: IconType; classes: string }>;
