import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

type NumberPickerProps = {
  label: string;
  subLabel?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  error?: string;
  onChangeEnd?: (value: number) => void;
};

const easeOutCubic = (time: number) => {
  return 1 - Math.pow(1 - time, 3);
};

function getNumberStyle(distance: number): string {
  if (distance === 0) {
    return "text-[28px] font-bold text-[#68d4ff] opacity-100";
  }

  if (distance === 1) {
    return "text-3xl font-medium text-white opacity-90";
  }

  if (distance === 2) {
    return "text-2xl font-normal text-white opacity-70";
  }

  return "text-xl font-normal text-white opacity-50";
}

export default function NumberPicker({
  label,
  subLabel,
  min = 0,
  max = 200,
  step = 1,
  value,
  error,
  onChangeEnd,
}: NumberPickerProps) {
  const values = useMemo(() => {
    const result: number[] = [];
    for (let current = min; current <= max; current += step) {
      result.push(Number(current.toFixed(10)));
    }
    return result;
  }, [min, max, step]);

  const valueToIndex = useCallback(
    (selectedValue: number) => {
      const rawIndex = Math.round((selectedValue - min) / step);

      return Math.max(0, Math.min(rawIndex, values.length - 1));
    },
    [min, step, values.length],
  );

  const initialIndex = valueToIndex(value);
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex);
  const onChangeEndRef = useRef(onChangeEnd);

  useEffect(() => {
    onChangeEndRef.current = onChangeEnd;
  }, [onChangeEnd]);

  const rangeRef = useRef({
    min,
    step,
  });

  useEffect(() => {
    rangeRef.current = {
      min,
      step,
    };
  }, [min, step]);

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: initialIndex,
    mode: "snap",
    rubberband: false,
    dragSpeed: 0.85,
    renderMode: "performance",
    defaultAnimation: {
      duration: 280,
      easing: easeOutCubic,
    },
    slides: {
      perView: "auto",
      origin: "center",
      spacing: 0,
    },

    created(instance) {
      const selectedIndex = instance.track.details?.rel ?? initialIndex;

      setActiveIndex(selectedIndex);
    },

    slideChanged(instance) {
      const selectedIndex = instance.track.details?.rel ?? 0;

      setActiveIndex(selectedIndex);
    },

    animationEnded(instance) {
      const selectedIndex = instance.track.details?.rel ?? 0;

      const { min: currentMin, step: currentStep } = rangeRef.current;

      const selectedValue = currentMin + selectedIndex * currentStep;

      setActiveIndex(selectedIndex);

      onChangeEndRef.current?.(Number(selectedValue.toFixed(10)));
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

    instance.moveToIdx(nextIndex, false, {
      duration: 280,
      easing: easeOutCubic,
    });
  }, [value, valueToIndex, sliderInstanceRef]);

  const selectedValue = values[activeIndex] ?? value;

  return (
    <div dir="ltr" className="w-full min-w-0 max-w-full">
      <div className="w-full overflow-x-clip flex flex-col justify-start items-center gap-1.5">
        <div className="font-yekan compact:text-xl laptop:text-2xl font-extrabold self-end">
          {label}
          <span className="font-peyda compact:text-base laptop:text-lg font-medium mr-1">
            {subLabel}
          </span>
        </div>
        <div
          role="spinbutton"
          aria-label="انتخاب عدد"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={selectedValue}
          className="relative box-border w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[#314654] bg-[#181c22]"
        >
          <div
            ref={sliderRef}
            className=" keen-slider box-border h-13 w-full min-w-0 max-w-full overflow-hidden"
          >
            {values.map((item, index) => {
              const distance = Math.abs(index - activeIndex);
              return (
                <button
                  key={item}
                  type="button"
                  tabIndex={-1}
                  style={{
                    flex: "0 0 42px",
                    width: "42px",
                    minWidth: "42px",
                    maxWidth: "42px",
                  }}
                  onClick={() => {
                    sliderInstanceRef.current?.moveToIdx(index, false, {
                      duration: 280,
                      easing: easeOutCubic,
                    });
                  }}
                  className={`
                            keen-slider__slide
                            flex
                            h-13
                            cursor-pointer
                            select-none
                            items-center
                            justify-center
                            overflow-visible
                            pt-1
                            text-center
                            font-['RokhFaNum']
                            leading-none
                            tabular-nums
                            transition-[font-size,color,opacity]
                            duration-200
                            ease-out
                            ${getNumberStyle(distance)}
                          `}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div
            aria-hidden="true"
            className="
                      pointer-events-none
                      absolute
                      bottom-1
                      left-1/2
                      z-10
                      h-0
                      w-0
                      -translate-x-1/2
                      border-x-[5px]
                      border-b-[7px]
                      border-x-transparent
                      border-b-[#68d4ff]"
          />
        </div>
      </div>
      {error && (
        <small className="text-red-500 self-end text-xs font-peyda ml-2">
          {error}
        </small>
      )}
    </div>
  );
}
