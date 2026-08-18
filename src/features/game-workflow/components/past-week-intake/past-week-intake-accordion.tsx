import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { HiOutlineChevronDown } from "react-icons/hi";
import { PiArrowClockwiseFill } from "react-icons/pi";

type PastWeekIntakeProps = {
  title: string;
  color: string;
  children: ReactNode;
  onRefreshGroup: () => void;
};

const PastWeekIntakeAccordion = ({
  title,
  color,
  children,
  onRefreshGroup,
}: PastWeekIntakeProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const shouldReduceMotion = useReducedMotion();

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
          className="w-4 h-4 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="flex-1 text-white font-peyda text-lg">{title}</span>
        <PiArrowClockwiseFill
          className="text-xl text-blue-600 hover:text-blue-800 active:text-blue-800 cursor-pointer"
          onClick={onRefreshGroup}
        />
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
              text-xl
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
              className="w-full grid compact:grid-cols-2 mobile-lg:grid-cols-3 gap-2"
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
