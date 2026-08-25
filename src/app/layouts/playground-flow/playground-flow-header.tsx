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

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.25,
        ease: "easeOut",
      }}
      className="relative flex h-28 w-full shrink-0 items-center justify-center bg-darker-blue-200 compact:px-4 mobile-lg:px-6 pt-8 pb-2"
    >
      <AnimatePresence mode="wait">
        {onBack && (
          <motion.button
            key="playground-back"
            type="button"
            aria-label="بازگشت به مرحله قبل"
            onClick={onBack}
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : -18,
              rotate: shouldReduceMotion ? 0 : -8,
              scale: shouldReduceMotion ? 1 : 0.8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : -10,
              scale: shouldReduceMotion ? 1 : 0.85,
            }}
            whileHover={
              shouldReduceMotion
                ? undefined
                : {
                    x: 4,
                    scale: 1.06,
                  }
            }
            whileTap={
              shouldReduceMotion
                ? undefined
                : {
                    x: 7,
                    scale: 0.9,
                  }
            }
            transition={{
              duration: shouldReduceMotion ? 0.1 : 0.35,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className={`absolute inset-s-4 z-10 -translate-y-1/2 cursor-pointer text-blue-600 outline-none mobile-lg:inset-s-6 ${
              subTitle ? "top-1/2" : "top-[calc(50%+12px)]"
            }`}
          >
            <PiCaretRight
              className="compact:text-5xl fold:text-6xl laptop:text-7xl"
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${titleKey}`}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 16,
                filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -10,
                filter: shouldReduceMotion ? "blur(0px)" : "blur(4px)",
              }}
              transition={{
                duration: shouldReduceMotion ? 0.1 : 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="shrink-0 font-yekan compact:text-2xl fold:text-3xl laptop:text-4xl font-extrabold leading-tight text-white"
            >
              {title}
            </motion.h1>
          </AnimatePresence>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: subTitle ? 40 : 0,
            marginTop: subTitle ? 8 : 0,
          }}
          transition={{
            duration: shouldReduceMotion ? 0.1 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex w-full shrink-0 items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {subTitle && (
              <motion.h2
                key={`subtitle-${titleKey}`}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 10,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : -6,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-4/5 font-peyda text-center compact:text-sm fold:text-base laptop:text-lg font-medium leading-5 text-blue-600"
              >
                {subTitle}
              </motion.h2>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default PlaygroundFlowHeader;
