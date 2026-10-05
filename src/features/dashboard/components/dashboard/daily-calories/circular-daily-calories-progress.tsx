import { motion, useReducedMotion } from "framer-motion";
import { PiFireSimpleFill } from "react-icons/pi";

type CircularDailyCaloriesProgressProps = {
  value: number;
  max?: number;
};

const CircularDailyCaloriesProgress = ({
  value,
  max = 100,
}: CircularDailyCaloriesProgressProps) => {
  const shouldReduceMotion = useReducedMotion();

  const safeValue = Math.min(Math.max(value, 0), max);
  const progress = max > 0 ? safeValue / max : 0;

  return (
    <div className="relative compact:size-22.5 mobile:size-24 mobile-lg:size-28 fold:size-32 tablet:size-29 laptop:size-36 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="20"
          className="stroke-blue-300 dark:stroke-darker-blue-500"
        />

        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          strokeWidth="20"
          strokeLinecap="round"
          className="stroke-orange-300"
          transform="rotate(-90 50 50)"
          initial={shouldReduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <PiFireSimpleFill className="size-[34%] text-orange-300" />
      </div>
    </div>
  );
};

export default CircularDailyCaloriesProgress;
