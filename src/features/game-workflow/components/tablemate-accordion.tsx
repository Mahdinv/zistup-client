import { PiTrash, PiUsersThree } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";

import TextBox from "@/shared/base-components/text-box";
import NumberCounter from "@/shared/base-components/number-counter";
import Radio from "@/shared/base-components/radio";

const relationshipLevel = [
  { title: "خانواده", value: "family" },
  { title: "دوست", value: "friend" },
  { title: "همکار", value: "colleague" },
  { title: "سایر", value: "other" },
];

const influenceLevel = [
  { title: "هیچ", value: "none" },
  { title: "کم", value: "low" },
  { title: "متوسط", value: "medium" },
  { title: "زیاد", value: "high" },
];

const TablemateAccordion = () => {
  const [open, setOpen] = useState(true);

  return (
    <motion.div
      layout
      className="bg-darker-blue-300 w-full border border-dark rounded-2xl p-4"
      transition={{
        layout: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
    >
      <div
        className="w-full flex flex-row justify-start items-center gap-2 cursor-pointer select-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <PiUsersThree className="text-green-600 text-5xl" />

        <h2 className="flex-1 text-sm font-medium font-peyda text-white mt-1">
          همسفره اول{" "}
          <span className="text-xs text-blue-600 mr-0.5">(اختیاری)</span>
        </h2>

        <PiTrash
          className="text-3xl text-darker-blue-100 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            console.log("trash");
          }}
        />

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center"
        >
          <HiOutlineChevronDown className="text-4xl text-darker-blue-100" />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
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
                ease: "easeOut",
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{
                y: -8,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: -6,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="w-full border-t border-t-darker-blue-100 pt-3 mt-3 flex flex-col justify-start items-start gap-3"
            >
              <TextBox
                labelClasses="font-peyda! text-xs! font-medium! pr-3!"
                classes="border-green-950! text-green-950! rounded-sm! h-8.5!"
                label="نام همسفره"
                placeHolder="مثال: مهران"
              />

              <NumberCounter
                label="تعداد وعده مشترک در هفته"
                labelClasses="font-peyda! text-xs! font-medium! pr-3!"
                suffix="بار"
                suffixClasses="text-white text-sm font-peyda"
                valueClasses="text-[28px]!"
              />

              <Radio
                label="سطح ارتباط"
                labelClasses="font-peyda! text-xs! font-medium! pr-3!"
                gridClasses="grid-cols-4 gap-1"
                variant="green"
                options={relationshipLevel}
                value="friend"
                onChange={() => {}}
              />

              <Radio
                label="به نظر شما چقدر این فرد روی رژیم شما تاثیر می گذارد؟"
                labelClasses="font-peyda! text-xs! font-medium! pr-3!"
                gridClasses="grid-cols-4 gap-1"
                variant="green"
                options={influenceLevel}
                value="none"
                onChange={() => {}}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TablemateAccordion;
