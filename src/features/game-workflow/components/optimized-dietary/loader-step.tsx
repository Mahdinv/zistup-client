import { AnimatePresence, motion } from "framer-motion";
import { PiCheckFatFill } from "react-icons/pi";
import type { LoaderStepType } from "../../api/optimized-dietary.types";

type LoaderStepProps = {
  step: LoaderStepType;
  isLastStep: boolean;
};

const layoutTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

const LoaderStep = ({ step, isLastStep }: LoaderStepProps) => {
  const isCompleted = step.status === "completed";
  const isInProgress = step.status === "in-progress";

  const shouldShowDescription = isInProgress;

  return (
    <motion.li
      layout="position"
      transition={{
        layout: layoutTransition,
      }}
      className="
        relative
        w-full
        pb-2
        flex
        flex-row
        justify-start
        items-stretch
        gap-2
      "
    >
      <div
        className="
          relative
          flex-2/12
          flex
          justify-center
          compact:text-base
          fold:text-lg
          laptop:text-xl
        "
      >
        {!isLastStep && (
          <div
            className={`
              absolute
              z-0
              top-[0.7em]
              bottom-[-0.7em]
              w-0.5
              transition-colors
              duration-500
              ${isCompleted ? "bg-green-400" : "bg-dark"}
            `}
          />
        )}

        <div
          className={`
            absolute
            z-10
            top-[0.7em]
            -translate-y-1/2
            compact:size-8
            fold:size-9
            laptop:size-10
            border
            rounded-full
            p-2
            flex
            justify-center
            items-center
            transition-[background-color,border-color]
            duration-500
            ${
              isCompleted
                ? "bg-[#1B332D] border-green-950"
                : "bg-darker-blue-200 border-dark"
            }
          `}
        >
          {isInProgress && (
            <motion.div
              key={`pulse-${step.id}`}
              className="
                absolute
                inset-0
                origin-center
                rounded-full
                border
                border-blue-900
                pointer-events-none
                will-change-[transform,opacity]
              "
              initial={{
                scale: 1,
                opacity: 0,
              }}
              animate={{
                scale: [1, 1.05, 1.5, 1.5, 1],
                opacity: [0, 0.8, 0.7, 0, 0],
              }}
              transition={{
                duration: 1.6,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          )}

          <AnimatePresence mode="sync" initial={false}>
            {isCompleted ? (
              <motion.div
                key="completed"
                className="
                  absolute
                  flex
                  justify-center
                  items-center
                "
                initial={{
                  opacity: 0,
                  scale: 0.75,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <PiCheckFatFill
                  className="
                    text-green-400

                    compact:text-xl
                    fold:text-2xl
                    laptop:text-3xl
                  "
                />
              </motion.div>
            ) : (
              <motion.div
                key={step.status}
                className={`
                  absolute
                  compact:size-3
                  fold:size-4
                  laptop:size-5
                  border
                  border-blue-900
                  rounded-full
                  transition-[background-color,box-shadow]
                  duration-500
                  ${
                    isInProgress
                      ? `
                        bg-blue-400
                        shadow-[0_0_10.7px_0_rgba(117,213,230,0.4)]
                      `
                      : "bg-transparent"
                  }
                `}
                initial={false}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        layout="position"
        transition={{
          layout: layoutTransition,
        }}
        className={`
          flex-10/12
          ${shouldShowDescription ? "h-auto" : "h-14"}
          flex
          flex-col
          items-start
          justify-start
          gap-2
        `}
      >
        <h2
          className={`
            font-peyda
            font-bold
            compact:text-base
            fold:text-lg
            laptop:text-xl
            leading-[140%]
            transition-colors
            duration-500
            ${
              isCompleted
                ? "text-white"
                : isInProgress
                  ? "text-blue-500"
                  : "text-blue-900"
            }
          `}
        >
          {step.title}
        </h2>

        <AnimatePresence initial={false} mode="popLayout">
          {shouldShowDescription && (
            <motion.div
              key={`description-${step.id}`}
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -4,
              }}
              transition={{
                opacity: {
                  duration: 0.16,
                  ease: "easeOut",
                },
                y: {
                  duration: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="
                w-full
                bg-darker-blue-200
                border
                border-darker-blue-100
                rounded-xs
                p-2.5
                mb-2
                will-change-[transform,opacity]
              "
            >
              <h3
                className="
                  text-blue-700
                  font-peyda
                  font-medium
                  compact:text-sm
                  fold:text-base
                  laptop:text-lg
                  leading-[140%]
                  text-justify
                "
              >
                {step.description}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
};

export default LoaderStep;
