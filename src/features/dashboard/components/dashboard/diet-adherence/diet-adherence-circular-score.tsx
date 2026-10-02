import { motion, useReducedMotion } from "framer-motion";

type CircularScoreProps = {
  value: number;
  max?: number;
};

const CircularScore = ({ value, max = 100 }: CircularScoreProps) => {
  const shouldReduceMotion = useReducedMotion();

  const safeValue = Math.min(Math.max(value, 0), max);
  const progress = max > 0 ? safeValue / max : 0;

  return (
    <div
      className="
        relative shrink-0 overflow-visible
        compact:size-36
        fold:size-40
        laptop:size-44
      "
    >
      <svg
        className="absolute inset-0 size-full -rotate-90 overflow-visible"
        aria-hidden="true"
      >
        {/* Background */}
        <circle
          cx="50%"
          cy="50%"
          r="calc(50% - 8px)"
          fill="none"
          strokeWidth="12"
          className="stroke-blue-300 dark:stroke-darker-blue-500"
        />

        {/* Progress */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="calc(50% - 8px)"
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          className="stroke-green-400 dark:drop-shadow-[0_0_8px_rgba(44,229,127,0.8)]"
          initial={false}
          animate={{
            pathLength: progress,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />
      </svg>

      <div
        className="
                    absolute inset-0
                    flex flex-col
                    items-center justify-center
                    text-center
                    font-rokh
                    leading-none
                "
      >
        <span
          className="
                    font-bold
                    text-dark dark:text-white
                    compact:text-[48px]
                    fold:text-[52px]
                    laptop:text-[56px]
                "
        >
          {safeValue.toLocaleString("fa-IR")}
        </span>

        <span
          className="
                    -mt-2
                    font-rokh
                    text-[#BFBFBF]
                    compact:text-lg
                    fold:text-xl
                    laptop:text-2xl
                    leading-none
                "
        >
          <small className="font-peyda compact:text-lg fold:text-xl laptop:text-2xl">
            از
          </small>{" "}
          {max}
        </span>
      </div>
    </div>
  );
};

export default CircularScore;
