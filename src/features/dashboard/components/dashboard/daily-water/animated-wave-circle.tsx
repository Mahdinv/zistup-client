import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type AnimatedWaveCircleProps = {
  className?: string;
};

const VIEWBOX_SIZE = 200;
const WAVE_LENGTH = 200;

// موج‌ها بلندتر و برجسته‌تر
const BACK_WAVE_AMPLITUDE = 28;
const FRONT_WAVE_AMPLITUDE = 36;

// دریا کمی پایین‌تر
const BACK_WAVE_BASELINE_Y = 112;
const FRONT_WAVE_BASELINE_Y = 120;

const WAVE_START_X = -800;
const WAVE_END_X = 1000;
const WAVE_BOTTOM_Y = 220;

const buildWavePath = ({
  startX,
  endX,
  baselineY,
  waveLength,
  amplitude,
  bottomY,
}: {
  startX: number;
  endX: number;
  baselineY: number;
  waveLength: number;
  amplitude: number;
  bottomY: number;
}) => {
  let d = `M ${startX} ${baselineY}`;

  for (let x = startX; x < endX; x += waveLength) {
    const quarter = waveLength / 4;
    const half = waveLength / 2;
    const threeQuarter = (waveLength * 3) / 4;
    const end = x + waveLength;

    d += ` Q ${x + quarter} ${baselineY - amplitude} ${x + half} ${baselineY}`;
    d += ` Q ${x + threeQuarter} ${baselineY + amplitude} ${end} ${baselineY}`;
  }

  d += ` L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;

  return d;
};

const backWavePath = buildWavePath({
  startX: WAVE_START_X,
  endX: WAVE_END_X,
  baselineY: BACK_WAVE_BASELINE_Y,
  waveLength: WAVE_LENGTH,
  amplitude: BACK_WAVE_AMPLITUDE,
  bottomY: WAVE_BOTTOM_Y,
});

const frontWavePath = buildWavePath({
  startX: WAVE_START_X,
  endX: WAVE_END_X,
  baselineY: FRONT_WAVE_BASELINE_Y,
  waveLength: WAVE_LENGTH,
  amplitude: FRONT_WAVE_AMPLITUDE,
  bottomY: WAVE_BOTTOM_Y,
});

const AnimatedWaveCircle = ({ className = "" }: AnimatedWaveCircleProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`
        relative shrink-0 overflow-hidden rounded-full
        compact:size-22.5
        mobile:size-24
        mobile-lg:size-28
        fold:size-32
        tablet:size-29
        laptop:size-36
        border border-gray-100 dark:border-dark
        bg-blue-300 dark:bg-darker-blue-500
        ${className}
      `}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="absolute inset-0 size-full"
        preserveAspectRatio="none"
      >
        {/* Back wave - darker - moves LEFT */}
        <motion.g
          initial={{ x: 0 }}
          animate={shouldReduceMotion ? { x: 0 } : { x: [0, -WAVE_LENGTH] }}
          transition={{
            duration: 2.8,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ willChange: "transform" }}
        >
          <path
            d={backWavePath}
            className="fill-blue-600 dark:fill-darker-blue-100"
          />
        </motion.g>

        {/* Front wave - lighter - moves RIGHT */}
        <motion.g
          initial={{ x: -WAVE_LENGTH }}
          animate={
            shouldReduceMotion ? { x: -WAVE_LENGTH } : { x: [-WAVE_LENGTH, 0] }
          }
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ willChange: "transform" }}
        >
          <path d={frontWavePath} className="fill-blue-400" />
        </motion.g>
      </svg>
    </div>
  );
};

export default memo(AnimatedWaveCircle);
