import { memo } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PiCheckBold } from "react-icons/pi";

type AnimatedWaveCircleProps = {
  className?: string;
  progress: number;
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
const WAVE_BOTTOM_Y = 420;

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

const AnimatedWaveCircle = ({
  className = "",
  progress,
}: AnimatedWaveCircleProps) => {
  const shouldReduceMotion = useReducedMotion();
  const complete = progress >= 1;
  const animateWaves = !shouldReduceMotion && progress > 0 && !complete;

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
      {/* Keep route presence initial={false} from suppressing the wave loops. */}
      <AnimatePresence initial={true}>
        <svg
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          className="absolute inset-0 size-full"
          preserveAspectRatio="none"
        >
          <motion.g
            initial={false}
            animate={{ y: (0.5 - progress) * 320 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.4,
              ease: "easeOut",
            }}
          >
            {/* Back wave - darker - moves LEFT */}
            <motion.g
              initial={{ x: 0 }}
              animate={animateWaves ? { x: [0, -WAVE_LENGTH] } : { x: 0 }}
              transition={{
                ease: "linear",
                repeat: animateWaves ? Infinity : 0,
                duration: animateWaves ? 2.8 : 0,
              }}
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
                animateWaves ? { x: [-WAVE_LENGTH, 0] } : { x: -WAVE_LENGTH }
              }
              transition={{
                ease: "linear",
                repeat: animateWaves ? Infinity : 0,
                duration: animateWaves ? 2 : 0,
              }}
            >
              <path d={frontWavePath} className="fill-blue-400" />
            </motion.g>
          </motion.g>
        </svg>
      </AnimatePresence>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: complete ? 1 : 0, scale: complete ? 1 : 0.9 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.25,
          ease: "easeOut",
        }}
      >
        <span className="flex size-1/2 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-darker-blue-300 dark:text-blue-400">
          <PiCheckBold className="size-1/2" />
        </span>
      </motion.div>
    </div>
  );
};

export default memo(AnimatedWaveCircle);
