import { forwardRef, useEffect, useRef } from "react";

type Unit = "kilogram" | "gram" | "liter" | "number";

interface QuantityPickerProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  unit?: Unit;
}

interface PickerColumn {
  key: string;
  values: readonly number[];
  selected: number;
  label: string;
  onSelect: (value: number) => void;
  format?: (value: number) => string;
}

const ITEM_HEIGHT = 48;

const SCROLL_END_DELAY = 100;

const createRange = (min: number, max: number, step = 1) =>
  Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, index) => min + index * step,
  );

const KG_VALUES = createRange(0, 100);

const KG_GRAM_VALUES = createRange(0, 950, 50);

const GRAM_VALUES = createRange(50, 2000, 50);

const LITER_VALUES = createRange(1, 100);

const NUMBER_VALUES = createRange(1, 100);

const UNIT_CONFIG = {
  kilogram: {
    defaultValue: 0,
  },

  gram: {
    defaultValue: 50,
    min: 50,
    max: 2000,
    step: 50,
    values: GRAM_VALUES,
    label: "گرم",
  },

  liter: {
    defaultValue: 1,
    min: 1,
    max: 100,
    step: 1,
    values: LITER_VALUES,
    label: "لیتر",
  },

  number: {
    defaultValue: 1,
    min: 1,
    max: 100,
    step: 1,
    values: NUMBER_VALUES,
    label: "عدد",
  },
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeStep(value: number, min: number, max: number, step: number) {
  const normalized =
    min + Math.round((clamp(value, min, max) - min) / step) * step;

  return clamp(normalized, min, max);
}

interface WheelColumnProps {
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  format?: (value: number) => string;
}

function WheelColumn({ values, selected, onSelect, format }: WheelColumnProps) {
  const ref = useRef<HTMLDivElement>(null);

  const frameRef = useRef<number | null>(null);

  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onSelectRef = useRef(onSelect);

  const selectedRef = useRef(selected);

  const lastUserSelectedRef = useRef<number | null>(null);

  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (lastUserSelectedRef.current === selected) {
      lastUserSelectedRef.current = null;

      return;
    }

    const index = values.indexOf(selected);

    if (index === -1) return;

    const targetScrollTop = index * ITEM_HEIGHT;

    if (Math.abs(element.scrollTop - targetScrollTop) < 1) {
      return;
    }

    isProgrammaticScrollRef.current = true;

    element.scrollTo({
      top: targetScrollTop,
      behavior: "auto",
    });

    requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
    });
  }, [selected, values]);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const commitValue = () => {
      const rawIndex = Math.round(element.scrollTop / ITEM_HEIGHT);

      const index = clamp(rawIndex, 0, values.length - 1);

      const nextValue = values[index];

      if (nextValue === undefined) return;

      if (nextValue === selectedRef.current) {
        return;
      }

      lastUserSelectedRef.current = nextValue;

      selectedRef.current = nextValue;

      onSelectRef.current(nextValue);
    };

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        if (scrollEndTimerRef.current) {
          clearTimeout(scrollEndTimerRef.current);
        }

        scrollEndTimerRef.current = setTimeout(() => {
          commitValue();
        }, SCROLL_END_DELAY);
      });
    };

    element.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      element.removeEventListener("scroll", handleScroll);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, [values]);

  return (
    <div
      ref={ref}
      className="
        h-36
        w-14.5
        shrink-0
        overflow-y-scroll
        overscroll-contain
        snap-y
        snap-mandatory
        no-scrollbar
        select-none
      "
    >
      <div className="h-12 shrink-0" />

      {values.map((item) => (
        <div
          key={item}
          className="
            flex
            h-12
            shrink-0
            snap-center
            items-center
            justify-center
            pt-2
            font-rokh
            text-5xl
            font-medium
            leading-none
            text-white
          "
        >
          {format ? format(item) : item}
        </div>
      ))}

      <div className="h-12 shrink-0" />
    </div>
  );
}

const QuantityPicker = forwardRef<HTMLDivElement, QuantityPickerProps>(
  ({ value, onChange, onBlur, unit = "kilogram" }, ref) => {
    const defaultValue = UNIT_CONFIG[unit].defaultValue;

    const currentValue = value ?? defaultValue;

    let columns: PickerColumn[];

    if (unit === "kilogram") {
      const totalGrams = normalizeStep(
        Math.round(currentValue * 1000),
        0,
        100_950,
        50,
      );

      const kilogram = Math.floor(totalGrams / 1000);

      const gram = totalGrams % 1000;

      const updateKilogram = (newKilogram: number, newGram: number) => {
        const result = newKilogram + newGram / 1000;

        onChange?.(result);
      };

      columns = [
        {
          key: "kilogram",
          values: KG_VALUES,
          selected: kilogram,
          label: "کیلو",
          onSelect: (newKilogram) => {
            updateKilogram(newKilogram, gram);
          },
        },

        {
          key: "gram",
          values: KG_GRAM_VALUES,
          selected: gram,
          label: "گرم",
          onSelect: (newGram) => {
            updateKilogram(kilogram, newGram);
          },
        },
      ];
    } else {
      const config = UNIT_CONFIG[unit];

      const selected = normalizeStep(
        currentValue,
        config.min,
        config.max,
        config.step,
      );

      columns = [
        {
          key: unit,
          values: config.values,
          selected,
          label: config.label,
          onSelect: (newValue) => {
            onChange?.(newValue);
          },
        },
      ];
    }

    return (
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <label className="font-peyda text-white compact:text-lg fold:text-xl laptop:text-2xl">
          می‌خوای چه مقداری از این مورد توی سبدت باشه؟
        </label>
        <div
          ref={ref}
          onBlur={onBlur}
          className="
          relative
          h-36
          w-full
          overflow-hidden
          rounded-2xl
          bg-darker-blue-500
        "
        >
          {/* Selected row background */}
          <div
            className="
            absolute
            inset-x-3
            top-1/2
            h-12
            -translate-y-1/2
            rounded-xs
            bg-[#202228]
          "
          />

          {/* Columns */}
          <div
            className={`
            relative
            z-10
            flex
            h-full
            w-full
            items-center
            px-4
            ${columns.length > 1 ? "justify-around" : "justify-center"}
          `}
          >
            {columns.map((column) => (
              <div
                key={column.key}
                className="
                flex
                items-center
                gap-4
              "
              >
                <WheelColumn
                  values={column.values}
                  selected={column.selected}
                  format={column.format}
                  onSelect={column.onSelect}
                />

                <span
                  className="
                  shrink-0
                  font-peyda
                  compact:text-base
                  fold:text-lg
                  laptop:text-xl
                  font-bold
                  text-blue-800
                "
                >
                  {column.label}
                </span>
              </div>
            ))}
          </div>

          {/* Top fade */}
          <div
            className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-20
            h-12
            bg-linear-to-b
            from-[#090A0F]
            to-transparent
          "
          />

          {/* Bottom fade */}
          <div
            className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-12
            bg-linear-to-t
            from-[#090A0F]
            to-transparent
          "
          />
        </div>
      </div>
    );
  },
);

QuantityPicker.displayName = "QuantityPicker";

export default QuantityPicker;
