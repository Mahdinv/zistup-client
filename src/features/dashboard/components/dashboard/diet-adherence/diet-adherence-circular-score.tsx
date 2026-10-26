import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import {
  adherenceScoreColors,
  type AdherenceTone,
} from "../../../lib/diet-adherence.utils";

type CircularScoreProps = {
  value: number | null;
  max: number;
  progress: number;
  tone: AdherenceTone;
};

const CircularScore = ({ value, max, progress, tone }: CircularScoreProps) => {
  const shouldReduceMotion = useReducedMotion();
  const pathLength = useMotionValue(0);
  const hasScore = value !== null;
  const label = value === null ? "امتیازی ثبت نشده" : `${value} از ${max}`;

  useEffect(() => {
    if (!hasScore) {
      pathLength.set(0);
      return;
    }

    // Drive the initial fetch independently of the dashboard's initial={false}.
    const animation = animate(pathLength, progress, {
      duration: shouldReduceMotion ? 0 : 0.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => animation.stop();
  }, [hasScore, pathLength, progress, shouldReduceMotion]);

  return (
    <div
      role={value === null ? "img" : "meter"}
      aria-label={`امتیاز پایبندی به رژیم: ${label}`}
      aria-valuemin={value === null ? undefined : 0}
      aria-valuemax={value === null ? undefined : max}
      aria-valuenow={value ?? undefined}
      className="relative shrink-0 overflow-visible size-35 fold:size-40 laptop:size-44"
    >
      <svg
        viewBox="0 0 140 140"
        className="absolute inset-0 size-full -rotate-90 overflow-visible"
        aria-hidden="true"
      >
        {value === null ? (
          <circle
            cx="70"
            cy="70"
            r="68"
            fill="none"
            strokeWidth="4"
            strokeDasharray="10 8"
            className="stroke-gray-200 dark:stroke-dark"
          />
        ) : (
          <>
            <circle
              cx="70"
              cy="70"
              r="64"
              fill="none"
              strokeWidth="12"
              className="stroke-blue-300 dark:stroke-darker-blue-500"
            />
            <motion.circle
              cx="70"
              cy="70"
              r="64"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              style={{ pathLength }}
              animate={{
                opacity: progress > 0 ? 1 : 0,
                color: adherenceScoreColors[tone],
                filter: `drop-shadow(0px 0px ${tone === "high" ? 8 : 4}px currentColor)`,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }
            />
          </>
        )}
      </svg>
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center font-rokh leading-none"
      >
        <span
          dir="ltr"
          className="font-bold text-dark dark:text-white text-[40px] fold:text-[44px] laptop:text-[48px]"
        >
          {value === null ? "--" : value.toLocaleString("fa-IR")}
        </span>
        <span className="font-rokh font-semibold text-gray-700 dark:text-[#BFBFBF] text-lg fold:text-xl laptop:text-2xl leading-none">
          از {max.toLocaleString("fa-IR")}
        </span>
      </div>
    </div>
  );
};

export default CircularScore;
