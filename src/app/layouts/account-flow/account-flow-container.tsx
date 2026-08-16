import { useState, type ReactNode } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type AccountFlowContainerProps = {
  stepKey: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  scrollMode?: "container" | "child";
  children: ReactNode;
};

type StepState = {
  previous: number;
  current: number;
};

const AccountFlowContainer = ({
  stepKey,
  isFirstStep,
  isLastStep,
  scrollMode = "container",
  children,
}: AccountFlowContainerProps) => {
  const shouldReduceMotion = useReducedMotion();

  const [stepState, setStepState] = useState<StepState>(() => ({
    previous: stepKey,
    current: stepKey,
  }));

  if (stepState.current !== stepKey) {
    setStepState({
      previous: stepState.current,
      current: stepKey,
    });
  }

  const direction =
    stepState.current === stepState.previous
      ? 0
      : stepState.current > stepState.previous
        ? 1
        : -1;

  const getBorderRadius = () => {
    if (isFirstStep) {
      return {
        borderTopRightRadius: [0, 0, 20],
        borderTopLeftRadius: [20, 0, 0],
      };
    }

    if (isLastStep) {
      return {
        borderTopRightRadius: [20, 0, 0],
        borderTopLeftRadius: [0, 0, 20],
      };
    }

    return {
      borderTopRightRadius: [20, 0, 0],
      borderTopLeftRadius: [20, 0, 0],
    };
  };

  const parentScrollClass =
    scrollMode === "container" ? "overflow-y-auto" : "overflow-y-hidden";

  const contentHeightClass =
    scrollMode === "container" ? "min-h-full" : "h-full min-h-0";

  const distance = shouldReduceMotion ? 0 : 32;

  return (
    <motion.div
      initial={false}
      animate={getBorderRadius()}
      transition={
        shouldReduceMotion || direction === 0
          ? {
              duration: 0,
            }
          : {
              duration: 0.7,
              times: [0, 0.45, 1],
              ease: "easeInOut",
            }
      }
      className="
        relative
        h-full
        min-h-0
        w-full
        min-w-0
        overflow-hidden
        bg-darker-blue-200
        text-white
      "
    >
      <div
        className={`
          h-full
          min-h-0
          w-full
          overflow-x-hidden
          overscroll-contain
          ${parentScrollClass}
        `}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepKey}
            custom={direction}
            variants={{
              enter: (currentDirection: number) => ({
                x:
                  currentDirection > 0
                    ? distance
                    : currentDirection < 0
                      ? -distance
                      : shouldReduceMotion
                        ? 0
                        : 22,

                opacity: 0,
              }),

              center: {
                x: 0,
                opacity: 1,
              },

              exit: (currentDirection: number) => ({
                x:
                  currentDirection > 0
                    ? -distance
                    : currentDirection < 0
                      ? distance
                      : shouldReduceMotion
                        ? 0
                        : -22,

                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.32,

              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
              flex
              w-full
              min-w-0
              flex-col
              pt-7
              compact:px-4
              mobile-lg:px-6
              pb-[calc(1.75rem+env(safe-area-inset-bottom))]
              ${contentHeightClass}
            `}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AccountFlowContainer;
