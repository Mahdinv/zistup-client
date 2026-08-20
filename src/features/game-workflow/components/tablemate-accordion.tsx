import { PiTrash, PiUsersThree } from "react-icons/pi";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Controller, useFormContext } from "react-hook-form";

import TextBox from "@/shared/base-components/text-box";
import NumberCounter from "@/shared/base-components/number-counter";
import Radio from "@/shared/base-components/radio";
import type { TablematesForm } from "../schemas/tablemates.schema";

type TablemateAccordionProps = {
  index: number;
  isOpen: boolean;
  tablematesNumber?: number;
  onRemoveClick: () => void;
};

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

const titles = [
  "اول",
  "دوم",
  "سوم",
  "چهارم",
  "پنجم",
  "ششم",
  "هفتم",
  "هشتم",
  "نهم",
  "دهم",
];

const TablemateAccordion = ({
  index,
  isOpen,
  tablematesNumber,
  onRemoveClick,
}: TablemateAccordionProps) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TablematesForm>();

  const [open, setOpen] = useState(isOpen);

  const hasError = !!errors.tablemates?.[index];
  const isExpanded = open || hasError;

  const title = tablematesNumber ? titles[tablematesNumber - 1] : "";

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
        <PiUsersThree className="text-green-600 compact:text-5xl fold:text-6xl laptop:text-7xl" />

        <h2 className="flex-1 compact:text-sm fold:text-base laptop:text-lg font-medium font-peyda text-white mt-1">
          همسفره {title}
          <span className="compact:text-xs fold:text-sm laptop:text-base text-blue-600 mr-0.5">
            {" "}
            (اختیاری)
          </span>
        </h2>

        <PiTrash
          className="compact:text-3xl fold:text-4xl laptop:text-5xl text-darker-blue-100 cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onRemoveClick();
          }}
        />

        <motion.span
          animate={{
            rotate: isExpanded ? 180 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="flex items-center justify-center"
        >
          <HiOutlineChevronDown className="compact:text-4xl fold:text-5xl laptop:text-6xl text-darker-blue-100" />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
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
                labelClasses="font-peyda! compact:text-xs! fold:text-sm! laptop:text-base! font-medium! pr-3!"
                classes="border-green-950! text-green-950! rounded-sm! compact:h-8.5! fold:h-9! laptop:h-9.5!"
                label="نام همسفره"
                placeHolder="مثال: مهران"
                {...register(`tablemates.${index}.name`)}
                error={errors.tablemates?.[index]?.name?.message}
              />

              <Controller
                name={`tablemates.${index}.sharedMealsCount`}
                control={control}
                render={({ field }) => (
                  <NumberCounter
                    label="تعداد وعده مشترک در هفته"
                    labelClasses="font-peyda! compact:text-xs! fold:text-sm! laptop:text-base! font-medium! pr-3!"
                    suffix="بار"
                    suffixClasses="text-white compact:text-sm fold:text-base laptop:text-lg font-peyda"
                    valueClasses="text-[28px]!"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <Controller
                name={`tablemates.${index}.relationshipLevel`}
                control={control}
                render={({ field }) => (
                  <Radio
                    label="سطح ارتباط"
                    labelClasses="font-peyda! compact:text-xs! fold:text-sm! laptop:text-base! font-medium! pr-3!"
                    gridClasses="grid-cols-4 gap-1"
                    variant="green"
                    options={relationshipLevel}
                    value={field.value}
                    onChange={field.onChange}
                    error={
                      errors.tablemates?.[index]?.relationshipLevel?.message
                    }
                  />
                )}
              />

              <Controller
                name={`tablemates.${index}.influenceLevel`}
                control={control}
                render={({ field }) => (
                  <Radio
                    label="به نظر شما چقدر این فرد روی رژیم شما تاثیر می گذارد؟"
                    labelClasses="font-peyda! compact:text-xs! fold:text-sm! laptop:text-base! font-medium! pr-3!"
                    gridClasses="grid-cols-4 gap-1"
                    variant="green"
                    options={influenceLevel}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.tablemates?.[index]?.influenceLevel?.message}
                  />
                )}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TablemateAccordion;
