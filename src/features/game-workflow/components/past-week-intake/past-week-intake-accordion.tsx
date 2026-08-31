import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { HiOutlineChevronDown } from "react-icons/hi";
import { PiArrowClockwiseFill } from "react-icons/pi";

type PastWeekIntakeProps = {
  name: "past-week-intake" | "shopping";
  title: string;
  color: string;
  selectedItemCount?: number;
  children: ReactNode;
  onRefreshGroup?: () => void;
};

const PastWeekIntakeAccordion = ({
  name,
  title,
  color,
  selectedItemCount,
  children,
  onRefreshGroup,
}: PastWeekIntakeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const layoutMethodClasses =
    name === "shopping"
      ? "flex flex-col items-center"
      : "grid compact:grid-cols-2 mobile-lg:grid-cols-3";

  return (
    <div className="w-full flex flex-col justify-start gap-2">
      <div
        role="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          bg-darker-blue-300
          w-full
          border
          border-dark
          rounded-2xl
          py-3
          px-4
          flex
          flex-row
          items-center
          gap-3
          cursor-pointer
          select-none
          outline-0
        "
      >
        <div
          className="compact:w-4 compact:h-4 fold:w-5 fold:h-5 laptop:w-6 laptop:h-6 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="flex-1 text-white font-peyda compact:text-lg fold:text-xl laptop:text-2xl">
          {title}
        </span>
        {selectedItemCount !== undefined && selectedItemCount !== null && (
          <div className="compact:size-5.5 mobile-lg:size-6.5 fold:size-7.5 shrink-0 rounded-full bg-darker-blue-200 flex items-center justify-center">
            <span className="font-rokh text-white leading-none translate-y-1 compact:text-lg fold:text-xl laptop:text-2xl">
              {selectedItemCount}
            </span>
          </div>
        )}
        {onRefreshGroup && (
          <PiArrowClockwiseFill
            className="compact:text-xl fold:text-2xl laptop:text-3xl text-blue-600 hover:text-blue-800 active:text-blue-800 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              onRefreshGroup();
            }}
          />
        )}
        <motion.span
          className="flex items-center justify-center"
          animate={{
            rotate: isOpen ? 180 : 0,
          }}
          transition={
            shouldReduceMotion
              ? {
                  duration: 0,
                }
              : {
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
          style={{
            willChange: "transform",
          }}
        >
          <HiOutlineChevronDown
            className="
              compact:text-xl fold:text-2xl laptop:text-3xl
              text-blue-600
              hover:text-blue-800
              active:text-blue-800
            "
          />
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="accordion-content"
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
            transition={
              shouldReduceMotion
                ? {
                    duration: 0,
                  }
                : {
                    height: {
                      duration: 0.32,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }
            }
            className="overflow-hidden"
          >
            <motion.div
              initial={{
                y: shouldReduceMotion ? 0 : -6,
              }}
              animate={{
                y: 0,
              }}
              exit={{
                y: shouldReduceMotion ? 0 : -4,
              }}
              transition={
                shouldReduceMotion
                  ? {
                      duration: 0,
                    }
                  : {
                      duration: 0.28,
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              style={{
                willChange: "transform",
              }}
              className={`w-full ${layoutMethodClasses} gap-2`}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PastWeekIntakeAccordion;
