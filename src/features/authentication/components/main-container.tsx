import type { ReactNode } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";

type MainContainerProps = {
  stepKey: string | number;
  isFirstStep: boolean;
  isLastStep: boolean;
  scrollMode?: "container" | "child";
  children: ReactNode;
};

const MainContainer = ({
  stepKey,
  isFirstStep,
  isLastStep,
  scrollMode = "container",
  children,
}: MainContainerProps) => {
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

  return (
    <motion.div
      initial={{
        borderTopRightRadius: 20,
        borderTopLeftRadius: 0,
      }}
      animate={getBorderRadius()}
      transition={{
        duration: 0.7,
        times: [0, 0.45, 1],
        ease: "easeInOut",
      }}
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
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stepKey}
            initial={{
              x: isFirstStep ? 24 : -24,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: isFirstStep ? 24 : -24,
              opacity: 0,
            }}
            transition={{
              duration: 0.4,
              ease: easeInOut,
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
              will-change-[transform,opacity]
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

export default MainContainer;
