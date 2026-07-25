import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type MainContainerProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  children: ReactNode;
};

const MainContainer = ({
  isFirstStep,
  isLastStep,
  children,
}: MainContainerProps) => {
  const borderRadius = () => {
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
  return (
    <AnimatePresence initial={false}>
      <motion.div
        initial={{
          borderTopRightRadius: 20,
          borderTopLeftRadius: 0,
        }}
        animate={borderRadius()}
        transition={{
          duration: 0.7,
          times: [0, 0.45, 1],
          ease: "easeInOut",
        }}
        className="w-full min-w-0 h-full bg-darker-blue-200 text-white rounded-tr-2xl rounded-tl-2xl flex flex-row justify-start items-start overflow-x-hidden overflow-y-auto scrollbar-gutter-stable"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MainContainer;
