import { useState, type ReactNode } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type PlaygroundFlowContainerProps = {
  children: ReactNode;
  stepKey?: number;
};

type StepState = {
  previous: number | undefined;
  current: number | undefined;
};

const PlaygroundFlowContainer = ({
  children,
  stepKey,
}: PlaygroundFlowContainerProps) => {
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
    stepState.current === undefined ||
    stepState.previous === undefined ||
    stepState.current === stepState.previous
      ? 0
      : stepState.current > stepState.previous
        ? 1
        : -1;

  const animationKey = stepKey ?? "page";
  const stepDistance = shouldReduceMotion ? 0 : 22;
  const initialDistance = shouldReduceMotion ? 0 : 12;

  return (
    <div
      className="
        h-full
        min-h-0
        w-full
        max-w-full
        overflow-hidden
        compact:px-4
        mobile-lg:px-6
        pb-[calc(1.75rem+env(safe-area-inset-bottom))]
      "
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={animationKey}
          custom={direction}
          variants={{
            enter: (currentDirection: number) => ({
              x:
                currentDirection > 0
                  ? stepDistance
                  : currentDirection < 0
                    ? -stepDistance
                    : initialDistance,

              opacity: 0,
            }),

            center: {
              x: 0,
              opacity: 1,
            },

            exit: (currentDirection: number) => ({
              x:
                currentDirection > 0
                  ? -stepDistance
                  : currentDirection < 0
                    ? stepDistance
                    : -initialDistance,

              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            duration: shouldReduceMotion ? 0.12 : 0.42,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="
            h-full
            min-h-0
            w-full
            min-w-0
          "
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PlaygroundFlowContainer;
