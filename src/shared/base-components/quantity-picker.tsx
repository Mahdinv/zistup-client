import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from "react";

type Unit = "kilogram" | "gram" | "liter" | "number";

export interface CustomQuantityUnit {
  label: string;
  values: readonly number[];
}
interface UnitWheel {
  options: readonly { id: string; label: string; description?: string }[];
  value: string;
  onChange: (id: string) => void;
}
interface QuantityPickerProps {
  formatValue?: (value: number) => string;
  customUnit?: CustomQuantityUnit;
  unitWheel?: UnitWheel;
  label?: string;
  appearance?: "default" | "dashboard";
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
  label?: string;
  textColumn?: boolean;
  dimInactive?: boolean;
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  format?: (value: number) => string;
}

function WheelColumn({
  values,
  selected,
  onSelect,
  format,
  label = "مقدار",
  textColumn = false,
  dimInactive = false,
}: WheelColumnProps) {
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

  useLayoutEffect(() => {
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
      role="spinbutton"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={values[0]}
      aria-valuemax={values[values.length - 1]}
      aria-valuenow={selected}
      aria-valuetext={format ? format(selected) : String(selected)}
      onKeyDown={(event) => {
        const index = values.indexOf(selected);
        const next =
          event.key === "ArrowUp"
            ? index + 1
            : event.key === "ArrowDown"
              ? index - 1
              : event.key === "Home"
                ? 0
                : event.key === "End"
                  ? values.length - 1
                  : null;
        if (next === null || !values.length) return;
        event.preventDefault();
        onSelect(values[clamp(next, 0, values.length - 1)]);
      }}
      className={`cursor-grab active:cursor-grabbing h-36 overflow-y-scroll overscroll-contain snap-y snap-mandatory touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none focus-visible:outline-2 focus-visible:outline-blue-400 ${textColumn ? "min-w-0 flex-1 font-peyda" : "w-16 shrink-0 font-rokh"}`}
    >
      <div className="h-12 shrink-0" />

      {values.map((item) => (
        <div
          key={item}
          onClick={() => onSelect(item)}
          className={`flex h-12 shrink-0 snap-center items-center justify-center cursor-inherit px-1 leading-none ${textColumn ? "text-base font-bold" : "pt-2 text-5xl font-medium"} ${(!dimInactive && !textColumn) || item === selected ? (textColumn ? "text-blue-400" : "text-white") : textColumn ? "text-blue-800" : "text-white/40"}`}
        >
          {format ? format(item) : item}
        </div>
      ))}

      <div className="h-12 shrink-0" />
    </div>
  );
}

const QuantityPicker = forwardRef<HTMLDivElement, QuantityPickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      unit = "kilogram",
      customUnit,
      formatValue,
      unitWheel,
      label = "می‌خوای چه مقداری از این مورد توی سبدت باشه؟",
      appearance = "default",
    },
    ref,
  ) => {
    const unitIndexes = useMemo(
      () =>
        Array.from(
          { length: unitWheel?.options.length ?? 0 },
          (_, index) => index,
        ),
      [unitWheel?.options.length],
    );
    const defaultValue = UNIT_CONFIG[unit].defaultValue;

    const currentValue = value ?? defaultValue;

    let columns: PickerColumn[];

    if (customUnit) {
      columns = [
        {
          key: "custom",
          values: customUnit.values,
          selected: currentValue,
          label: customUnit.label,
          onSelect: (next) => onChange?.(next),
        },
      ];
    } else if (unit === "kilogram") {
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
      <div
        className={
          "w-full flex flex-col justify-start items-start " +
          (appearance === "dashboard"
            ? "gap-1 [&_.font-rokh]:w-24 [&_.font-rokh>div]:text-[32px]"
            : "gap-3")
        }
      >
        {label && (
          <p
            className={
              appearance === "dashboard"
                ? "font-peyda font-bold text-inherit"
                : "font-peyda text-white compact:text-lg fold:text-xl laptop:text-2xl"
            }
          >
            {label}
          </p>
        )}
        <div
          ref={ref}
          onBlur={onBlur}
          className={`
          relative
          ${appearance === "dashboard" ? "h-[132px]" : "h-36"}
          w-full
          overflow-hidden
          rounded-2xl
          ${appearance === "dashboard" ? "bg-darker-blue-200 dark:bg-darker-blue-500" : "bg-darker-blue-500"}
        `}
        >
          {/* Selected row background */}
          <div
            className={`
            absolute
            inset-x-3
            top-1/2
            h-12
            -translate-y-1/2
            rounded-xs
            ${appearance === "dashboard" ? "h-[34px] bg-darker-blue-100 dark:bg-[#202228]" : "bg-[#202228]"}
          `}
          />

          {/* Columns */}
          <div
            className={`
            ${appearance === "dashboard" ? "absolute top-1/2 -translate-y-1/2 !h-36" : "relative"}
            z-10
            flex
            h-full
            w-full
            items-center
            px-4
            ${columns.length > 1 ? "justify-around" : "justify-center"}
          `}
          >
            {unitWheel && customUnit ? (
              <div
                className={`flex w-full items-center gap-2 ${unitWheel.options.some((option) => option.description) ? "max-w-64" : "max-w-44"}`}
              >
                <WheelColumn
                  dimInactive
                  format={formatValue}
                  values={customUnit.values}
                  selected={currentValue}
                  onSelect={(next) => onChange?.(next)}
                />
                <WheelColumn
                  textColumn
                  label="واحد مقدار"
                  values={unitIndexes}
                  selected={unitWheel.options.findIndex(
                    (option) => option.id === unitWheel.value,
                  )}
                  format={(index) => {
                    const option = unitWheel.options[index];
                    return option
                      ? [option.label, option.description]
                          .filter(Boolean)
                          .join(" ")
                      : "";
                  }}
                  onSelect={(index) => {
                    const option = unitWheel.options[index];
                    if (option) unitWheel.onChange(option.id);
                  }}
                />
              </div>
            ) : (
              columns.map((column) => (
                <div
                  key={column.key}
                  className="
                flex
                items-center
                gap-4
              "
                >
                  <WheelColumn
                    dimInactive={appearance === "dashboard"}
                    values={column.values}
                    selected={column.selected}
                    format={formatValue ?? column.format}
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
              ))
            )}
          </div>

          {/* Top fade */}
          <div
            className={`
            pointer-events-none
            absolute
            inset-x-0
            top-0
            z-20
            h-12
            bg-linear-to-b
            ${appearance === "dashboard" ? "!h-[18px] from-darker-blue-200 dark:from-darker-blue-500" : "from-[#090A0F]"}
            to-transparent
          `}
          />

          {/* Bottom fade */}
          <div
            className={`
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            z-20
            h-12
            bg-linear-to-t
            ${appearance === "dashboard" ? "from-darker-blue-200 dark:from-darker-blue-500" : "from-[#090A0F]"}
            to-transparent
          `}
          />
        </div>
      </div>
    );
  },
);

QuantityPicker.displayName = "QuantityPicker";

export default QuantityPicker;
