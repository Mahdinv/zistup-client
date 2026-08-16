import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { PiCaretRight } from "react-icons/pi";

type PlaygroundFlowHeaderProps = {
  title?: string;
  subTitle?: string;
  onBack?: () => void;
};

const PlaygroundFlowHeader = ({
  title,
  subTitle,
  onBack,
}: PlaygroundFlowHeaderProps) => {
  const shouldReduceMotion = useReducedMotion();

  const titleKey = [title, subTitle].filter(Boolean).join("-");

  const horizontalOffset = shouldReduceMotion ? 0 : 12;

  return (
    <header
      className="
        flex
        h-36
        w-full
        shrink-0
        flex-col
        bg-darker-blue-200
        compact:px-4
        mobile-lg:px-6
        py-3
      "
    >
      <div
        className="
          flex
          h-9
          shrink-0
          items-center
          justify-start
        "
      >
        <AnimatePresence mode="wait">
          {onBack && (
            <motion.button
              key={`playground-back-${titleKey}`}
              type="button"
              aria-label="بازگشت به مرحله قبل"
              onClick={onBack}
              initial={{
                opacity: 0,
                scale: shouldReduceMotion ? 1 : 0.88,
                x: shouldReduceMotion ? 0 : 6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                scale: shouldReduceMotion ? 1 : 0.92,
                x: shouldReduceMotion ? 0 : -4,
              }}
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: 0.92,
                    }
              }
              transition={{
                duration: shouldReduceMotion ? 0.12 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                rounded-sm
                border
                border-blue-600
                p-1.5
                text-blue-600
                outline-none
                transition-colors
                hover:bg-blue-600/10
                focus-visible:ring-2
                focus-visible:ring-blue-600
              "
            >
              <PiCaretRight className="text-xl" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div
        className="
          flex
          min-h-0
          flex-1
          items-end
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={titleKey}
            initial={{
              opacity: 0,
              x: horizontalOffset,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -horizontalOffset,
            }}
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              h-16
              w-full
              flex-col
              justify-end
            "
          >
            <h1
              className="
                shrink-0
                font-yekan
                text-3xl
                font-extrabold
                leading-tight
                text-white
              "
            >
              {title}
            </h1>
            <div
              className="
                mt-1
                min-h-5
                w-full
              "
            >
              {subTitle && (
                <p
                  className="
                    font-peyda
                    text-sm
                    font-medium
                    leading-5
                    text-blue-600
                  "
                >
                  {subTitle}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  );
};

export default PlaygroundFlowHeader;
