import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type RulerBoxProps = {
  min?: number;
  max?: number;
  step?: number;
  majorStep?: number;
  value: number;
  label?: string;
  subLabel?: string;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
};

const ANIMATION_DURATION = 420;
const TICK_WIDTH = 12;

const easeOutQuart = (time: number) => {
  return 1 - Math.pow(1 - time, 4);
};

const normalizeNumber = (value: number) => {
  return Number(value.toFixed(10));
};

const persianNumberFormatter = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
  maximumFractionDigits: 2,
});

export default function RulerBox({
  min = 140,
  max = 220,
  step = 1,
  majorStep = 5,
  value,
  label,
  subLabel,
  onChange,
  onChangeEnd,
}: RulerBoxProps) {
  const safeStep = step > 0 ? step : 1;
  const safeMajorStep = majorStep > 0 ? majorStep : 5;
  const safeMax = Math.max(min, max);

  const values = useMemo(() => {
    const count = Math.floor((safeMax - min) / safeStep + 0.000001) + 1;

    return Array.from({ length: count }, (_, index) => {
      return normalizeNumber(min + index * safeStep);
    });
  }, [min, safeMax, safeStep]);

  const valueToIndex = useCallback(
    (selectedValue: number) => {
      const rawIndex = Math.round((selectedValue - min) / safeStep);

      return Math.max(0, Math.min(rawIndex, values.length - 1));
    },
    [min, safeStep, values.length],
  );

  const initialIndex = valueToIndex(value);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const [isDragging, setIsDragging] = useState(false);

  const latestPropsRef = useRef({
    min,
    step: safeStep,
    onChange,
    onChangeEnd,
  });

  const externalMoveRef = useRef(false);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    latestPropsRef.current = {
      min,
      step: safeStep,
      onChange,
      onChangeEnd,
    };
  }, [min, safeStep, onChange, onChangeEnd]);

  const getValueByIndex = (index: number) => {
    const currentMin = latestPropsRef.current.min;
    const currentStep = latestPropsRef.current.step;

    return normalizeNumber(currentMin + index * currentStep);
  };

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: initialIndex,

    mode: "free-snap",

    rubberband: false,

    dragSpeed: 1.2,

    renderMode: "performance",

    defaultAnimation: {
      duration: ANIMATION_DURATION,
      easing: easeOutQuart,
    },

    slides: {
      perView: "auto",
      origin: "center",
      spacing: 0,
    },

    created(instance) {
      const index = instance.track.details?.rel ?? initialIndex;

      setActiveIndex(index);
    },

    dragStarted() {
      externalMoveRef.current = false;
      wasDraggedRef.current = true;

      setIsDragging(true);
    },

    dragEnded() {
      setIsDragging(false);

      window.setTimeout(() => {
        wasDraggedRef.current = false;
      }, 0);
    },

    slideChanged(instance) {
      const index = instance.track.details?.rel ?? 0;

      setActiveIndex((previousIndex) => {
        return previousIndex === index ? previousIndex : index;
      });

      if (externalMoveRef.current) {
        return;
      }

      latestPropsRef.current.onChange?.(getValueByIndex(index));
    },

    animationEnded(instance) {
      const index = instance.track.details?.rel ?? 0;

      setIsDragging(false);

      if (externalMoveRef.current) {
        externalMoveRef.current = false;
        return;
      }

      latestPropsRef.current.onChangeEnd?.(getValueByIndex(index));
    },

    animationStopped() {
      externalMoveRef.current = false;
      setIsDragging(false);
    },
  });

  useEffect(() => {
    const instance = sliderInstanceRef.current;

    if (!instance?.track.details) {
      return;
    }

    const nextIndex = valueToIndex(value);
    const currentIndex = instance.track.details.rel;

    if (currentIndex === nextIndex) {
      return;
    }

    externalMoveRef.current = true;

    instance.moveToIdx(nextIndex, false, {
      duration: ANIMATION_DURATION,
      easing: easeOutQuart,
    });
  }, [value, valueToIndex, sliderInstanceRef]);

  const moveToIndex = useCallback(
    (index: number) => {
      const instance = sliderInstanceRef.current;

      if (!instance) {
        return;
      }

      const safeIndex = Math.max(0, Math.min(index, values.length - 1));

      externalMoveRef.current = false;

      instance.moveToIdx(safeIndex, false, {
        duration: ANIMATION_DURATION,
        easing: easeOutQuart,
      });
    },
    [sliderInstanceRef, values.length],
  );

  const handleTickClick = (index: number) => {
    if (wasDraggedRef.current) {
      return;
    }

    moveToIndex(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault();
        moveToIndex(activeIndex + 1);
        break;
      }

      case "ArrowLeft": {
        event.preventDefault();
        moveToIndex(activeIndex - 1);
        break;
      }

      case "Home": {
        event.preventDefault();
        moveToIndex(0);
        break;
      }

      case "End": {
        event.preventDefault();
        moveToIndex(values.length - 1);
        break;
      }
    }
  };

  const isMajorTick = (tickValue: number) => {
    const division = tickValue / safeMajorStep;

    return Math.abs(division - Math.round(division)) < 0.000001;
  };

  const selectedValue = values[activeIndex] ?? value;

  return (
    <div
      dir="rtl"
      className="
        w-full
        min-w-0
        max-w-none
        self-stretch
        font-rokh
      "
    >
      <div className="mb-1 text-right text-white">
        <span
          className="
            text-xl
            font-yekan
            font-extrabold
          "
        >
          {label}
        </span>

        <span
          className="
            mr-1
            text-sm
            font-normal
            font-peyda
            text-white
          "
        >
          {subLabel}
        </span>
      </div>

      <div
        dir="ltr"
        role="spinbutton"
        tabIndex={0}
        aria-label={`${label} بر حسب ${subLabel}`}
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-valuenow={selectedValue}
        aria-valuetext={`${selectedValue} ${subLabel}`}
        onKeyDown={handleKeyDown}
        className="
          relative
          h-23.5
          w-full
          min-w-0
          max-w-none
          overflow-hidden
          rounded-2xl
          border
          border-darker-blue-100
          bg-darker-blue-400
          outline-none
          transition-shadow
          focus-visible:ring-2
          focus-visible:ring-[#68d4ff]/60
        "
      >
        <output
          aria-live="polite"
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-2.5
            z-30
            text-center
            text-[28px]
            font-bold
            leading-none
            text-blue-400
          "
        >
          {persianNumberFormatter.format(selectedValue)}
        </output>

        <div
          className="
            group
            absolute
            inset-x-0
            bottom-0
            h-12
            w-full
            min-w-0
          "
        >
          <div
            ref={sliderRef}
            className="
              keen-slider
              h-full
              w-full
              min-w-0
              cursor-grab
              touch-pan-y
              select-none
              will-change-transform
              active:cursor-grabbing
            "
          >
            {values.map((item, index) => {
              const major = isMajorTick(item);

              return (
                <button
                  key={item}
                  type="button"
                  tabIndex={-1}
                  draggable={false}
                  aria-label={`${item} ${subLabel}`}
                  onClick={() => {
                    handleTickClick(index);
                  }}
                  style={{
                    flex: `0 0 ${TICK_WIDTH}px`,
                    width: TICK_WIDTH,
                    minWidth: TICK_WIDTH,
                    maxWidth: TICK_WIDTH,
                    height: 48,
                    position: "relative",
                    overflow: "visible",
                  }}
                  className="
                    keen-slider__slide
                    shrink-0
                    cursor-grab
                    select-none
                    border-0
                    bg-transparent
                    p-0
                    outline-none
                    active:cursor-grabbing
                    [WebkitTapHighlightColor:transparent]
                  "
                >
                  <span
                    aria-hidden="true"
                    className={`
                      pointer-events-none
                      absolute
                      bottom-4
                      left-1/2
                      block
                      w-px
                      -translate-x-1/2
                      rounded-full
                      bg-white/90
                      transition-opacity
                      duration-150
                      ease-out
                      ${major ? "h-6" : "h-4"}
                    `}
                  />

                  {major && (
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        bottom-0
                        left-1/2
                        block
                        w-10
                        -translate-x-1/2
                        whitespace-nowrap
                        text-center
                        text-xs
                        font-normal
                        text-white/45
                      "
                    >
                      {persianNumberFormatter.format(item)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className={`
              pointer-events-none
              absolute
              bottom-4
              left-1/2
              z-30
              h-8
              w-0.5
              -translate-x-1/2
              rounded-full
              bg-blue-400
              transition-[box-shadow,opacity]
              duration-200
              ease-out
              ${
                isDragging
                  ? `
                    opacity-100
                    shadow-[0_0_12px_rgba(104,212,255,0.65)]
                  `
                  : `
                    opacity-90
                    shadow-[0_0_5px_rgba(104,212,255,0.2)]
                    group-hover:opacity-100
                    group-hover:shadow-[0_0_10px_rgba(104,212,255,0.5)]
                  `
              }
            `}
          />
        </div>
      </div>
    </div>
  );
}
