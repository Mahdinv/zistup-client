import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  gramStepWheel?: { min: number; max: number; initialStep?: number };
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

const GRAM_MULTIPLIERS = [0.5, 1, 2, 5, 10] as const;
const ITEM_HEIGHT = 48;

const SCROLL_END_DELAY = 100;
const WHEEL_WINDOW_SIZE = 16;

const createRange = (min: number, max: number, step = 1) =>
  Array.from(
    { length: Math.floor((max - min) / step) + 1 },
    (_, index) => min + index * step,
  );

const KG_VALUES = createRange(0, 100);

const KG_GRAM_VALUES = createRange(0, 950, 50);

const GRAM_VALUES = createRange(50, 2000, 50);

const LITER_VALUES = createRange(0.5, 100, 0.5);

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
    defaultValue: 0.5,
    min: 0.5,
    max: 100,
    step: 0.5,
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
  curved?: boolean;
  dimInactive?: boolean;
  dashboard?: boolean;
  values: readonly number[];
  selected: number;
  onSelect: (value: number) => void;
  format?: (value: number) => string;
}

function CurvedWheelLabel({
  index,
  position,
  children,
}: {
  index: number;
  position: MotionValue<number>;
  children: React.ReactNode;
}) {
  const x = useTransform(position, (value) => -Math.abs(index - value) * 7);
  const rotate = useTransform(position, (value) => (index - value) * 15);
  const opacity = useTransform(position, (value) =>
    Math.max(0.2, 1 - Math.abs(index - value) * 0.35),
  );
  return (
    <motion.span
      className="block whitespace-nowrap"
      style={{ x, rotate, opacity }}
    >
      {children}
    </motion.span>
  );
}

function WheelColumn({
  values,
  selected,
  onSelect,
  format,
  label = "مقدار",
  textColumn = false,
  curved = false,
  dimInactive = false,
  dashboard = false,
}: WheelColumnProps) {
  const rowHeight = curved ? 32 : ITEM_HEIGHT;
  const reduceMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const scrollPosition = useMotionValue(Math.max(0, values.indexOf(selected)));
  const ref = useRef<HTMLDivElement>(null);
  const targetIndexRef = useRef<number | null>(null);
  const syncFrameRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSelectRef = useRef(onSelect);
  const selectedRef = useRef(selected);
  const lastUserSelectionRef = useRef<{
    value: number;
    values: readonly number[];
  } | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  // Gram wheels can contain 4,000 rows. Keep a buffered window in the DOM
  // while spacers retain the full scroll range. Snap after scrolling ends:
  // native CSS snapping would clamp flings to the currently mounted rows.
  const virtualized = dashboard && !textColumn && !curved;
  const selectedAnchor =
    Math.floor(Math.max(0, values.indexOf(selected)) / WHEEL_WINDOW_SIZE) *
    WHEEL_WINDOW_SIZE;
  const [windowState, setWindowState] = useState({
    anchor: selectedAnchor,
    selected,
    values,
  });
  if (
    virtualized &&
    (windowState.selected !== selected || windowState.values !== values)
  ) {
    setWindowState({ anchor: selectedAnchor, selected, values });
  }
  const windowAnchor = windowState.anchor;
  const start = virtualized ? Math.max(0, windowAnchor - WHEEL_WINDOW_SIZE) : 0;
  const end = virtualized
    ? Math.min(values.length, windowAnchor + WHEEL_WINDOW_SIZE * 2)
    : values.length;

  useLayoutEffect(() => {
    onSelectRef.current = onSelect;
    selectedRef.current = selected;
  }, [onSelect, selected]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || !isPresent) return;
    // A changed value list needs a new scroll offset, even for the same selection.
    const userSelection = lastUserSelectionRef.current;
    lastUserSelectionRef.current = null;
    if (userSelection?.value === selected && userSelection.values === values)
      return;
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    targetIndexRef.current = null;
    const index = values.indexOf(selected);
    if (index < 0) return;
    if (curved) scrollPosition.set(index);
    isProgrammaticScrollRef.current = true;
    element.scrollTo({ top: index * rowHeight, behavior: "instant" });
    syncFrameRef.current = requestAnimationFrame(() => {
      isProgrammaticScrollRef.current = false;
      syncFrameRef.current = null;
    });
    return () => {
      if (syncFrameRef.current !== null)
        cancelAnimationFrame(syncFrameRef.current);
      isProgrammaticScrollRef.current = false;
    };
  }, [selected, values, rowHeight, curved, scrollPosition, isPresent]);

  useEffect(() => {
    const element = ref.current;
    if (!element || !isPresent) return;
    const commitValue = () => {
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      if (isProgrammaticScrollRef.current) return;
      const target = targetIndexRef.current;
      if (
        target !== null &&
        Math.abs(element.scrollTop - target * rowHeight) > 1
      )
        return;
      targetIndexRef.current = null;
      const index = clamp(
        Math.round(element.scrollTop / rowHeight),
        0,
        values.length - 1,
      );
      if (virtualized && Math.abs(element.scrollTop - index * rowHeight) > 1) {
        targetIndexRef.current = index;
        element.scrollTo({
          top: index * rowHeight,
          behavior: reduceMotion ? "instant" : "smooth",
        });
        return;
      }
      const nextValue = values[index];
      if (nextValue === undefined || nextValue === selectedRef.current) return;
      lastUserSelectionRef.current = { value: nextValue, values };
      selectedRef.current = nextValue;
      onSelectRef.current(nextValue);
    };
    const handleScroll = () => {
      if (virtualized) {
        const index = clamp(
          Math.floor(element.scrollTop / rowHeight),
          0,
          values.length - 1,
        );
        const anchor = Math.floor(index / WHEEL_WINDOW_SIZE) * WHEEL_WINDOW_SIZE;
        setWindowState((previous) =>
          previous.anchor === anchor ? previous : { ...previous, anchor },
        );
      }
      // Motion batches visual updates without re-rendering the picker.
      if (curved) scrollPosition.set(element.scrollTop / rowHeight);
      if (isProgrammaticScrollRef.current) return;
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = setTimeout(commitValue, SCROLL_END_DELAY);
    };
    const interruptTarget = () => {
      targetIndexRef.current = null;
    };
    element.addEventListener("scroll", handleScroll, { passive: true });
    element.addEventListener("scrollend", commitValue);
    element.addEventListener("pointerdown", interruptTarget, { passive: true });
    element.addEventListener("wheel", interruptTarget, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
      element.removeEventListener("scrollend", commitValue);
      element.removeEventListener("pointerdown", interruptTarget);
      element.removeEventListener("wheel", interruptTarget);
      if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    };
  }, [
    values,
    rowHeight,
    curved,
    scrollPosition,
    isPresent,
    virtualized,
    reduceMotion,
  ]);

  const selectIndex = (index: number) => {
    if (!isPresent || !values.length) return;
    const next = clamp(index, 0, values.length - 1);
    const element = ref.current;
    if (
      !curved ||
      !element ||
      Math.abs(element.scrollTop - next * rowHeight) < 1
    ) {
      onSelect(values[next]);
      return;
    }
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    targetIndexRef.current = next;
    element.scrollTo({
      top: next * rowHeight,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  return (
    <div
      ref={ref}
      role="spinbutton"
      tabIndex={isPresent ? 0 : -1}
      inert={!isPresent}
      aria-hidden={!isPresent || undefined}
      aria-label={label}
      aria-valuemin={values[0]}
      aria-valuemax={values[values.length - 1]}
      aria-valuenow={selected}
      aria-valuetext={format ? format(selected) : String(selected)}
      onKeyDown={(event) => {
        const index = curved
          ? (targetIndexRef.current ??
            Math.round((ref.current?.scrollTop ?? 0) / rowHeight))
          : values.indexOf(selected);
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
        selectIndex(next);
      }}
      style={{ height: 144, overflowAnchor: "none" }}
      className={`cursor-grab active:cursor-grabbing overflow-y-scroll overflow-x-hidden overscroll-contain ${virtualized ? "" : "snap-y snap-mandatory"} touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none focus-visible:outline-2 focus-visible:outline-blue-400 ${textColumn ? "min-w-0 flex-1 font-peyda" : curved ? "w-12 shrink-0 font-rokh" : dashboard || values === LITER_VALUES ? "w-24 shrink-0 font-rokh" : "w-16 shrink-0 font-rokh"}`}
    >
      <div style={{ height: (144 - rowHeight) / 2 }} aria-hidden="true" />
      {virtualized && (
        <div style={{ height: start * rowHeight }} aria-hidden="true" />
      )}
      {values.slice(start, end).map((item, index) => (
        <div
          key={item}
          style={{ height: rowHeight }}
          onClick={() => selectIndex(start + index)}
          className={`flex snap-center items-center justify-center cursor-inherit px-1 leading-none ${curved ? "text-base font-medium text-white" : textColumn ? "text-base font-bold" : dashboard ? "pt-2 text-[32px] font-medium" : "pt-2 text-5xl font-medium"} ${curved ? "" : (!dimInactive && !textColumn) || item === selected ? (textColumn ? "text-blue-400" : "text-white") : textColumn ? "text-blue-800" : "text-white/40"}`}
        >
          {curved ? (
            <CurvedWheelLabel index={start + index} position={scrollPosition}>
              {format ? format(item) : item}
            </CurvedWheelLabel>
          ) : (
            <span className={textColumn ? "whitespace-nowrap" : undefined}>{format ? format(item) : item}</span>
          )}
        </div>
      ))}
      {virtualized && (
        <div
          style={{ height: (values.length - end) * rowHeight }}
          aria-hidden="true"
        />
      )}
      <div style={{ height: (144 - rowHeight) / 2 }} aria-hidden="true" />
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
      customUnit: suppliedCustomUnit,
      gramStepWheel,
      formatValue,
      unitWheel,
      label = "می‌خوای چه مقداری از این مورد توی سبدت باشه؟",
      appearance = "default",
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const hasGramWheel = Boolean(gramStepWheel);
    const [gramSelection, setGramSelection] = useState({
      enabled: hasGramWheel,
      step: gramStepWheel?.initialStep ?? 1,
      anchor: 0,
    });
    // Reset the multiplier on unit changes without remounting the scroll columns.
    if (gramSelection.enabled !== hasGramWheel) {
      setGramSelection({ enabled: hasGramWheel, step: gramStepWheel?.initialStep ?? 1, anchor: 0 });
    }
    const { step: gramStep, anchor: gramAnchor } = gramSelection;
    const minGrams = gramStepWheel?.min;
    const maxGrams = gramStepWheel?.max;
    const steppedValues = useMemo(() => {
      if (minGrams === undefined || maxGrams === undefined) return [];
      const min = Math.round(minGrams * 2);
      const max = Math.round(maxGrams * 2);
      const step = gramStep * 2;
      const offset = (((gramAnchor * 2 - min) % step) + step) % step;
      const values = Array.from(
        { length: Math.floor((max - min - offset) / step) + 1 },
        (_, index) => (min + offset + index * step) / 2,
      );
      if (values[0] !== min / 2) values.unshift(min / 2);
      return values;
    }, [minGrams, maxGrams, gramStep, gramAnchor]);
    const customUnit =
      suppliedCustomUnit && gramStepWheel
        ? { ...suppliedCustomUnit, values: steppedValues }
        : suppliedCustomUnit;
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
          (appearance === "dashboard" ? "gap-1" : "gap-3")
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
            <AnimatePresence>
              {gramStepWheel && (
                <motion.div
                  key="gram-step-wheel"
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.24,
                    ease: "easeOut",
                  }}
                  dir="ltr"
                  className="absolute left-3 top-0 h-36 w-12"
                >
                  <WheelColumn
                    curved
                    label="گام تغییر مقدار"
                    dimInactive
                    values={GRAM_MULTIPLIERS}
                    selected={gramStep}
                    format={(step) => step + "x"}
                    onSelect={(step) => {
                      setGramSelection({
                        enabled: true,
                        step,
                        anchor: currentValue,
                      });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            {unitWheel && customUnit ? (
              <motion.div
                key="quantity-columns"
                layout={reduceMotion ? false : "position"}
                transition={{
                  layout: {
                    duration: reduceMotion ? 0 : 0.24,
                    ease: "easeOut",
                  },
                }}
                className={`flex w-full items-center gap-2 ${gramStepWheel ? "ml-12" : ""} ${unitWheel.options.some((option) => option.description || option.label.length > 10) ? "max-w-64" : "max-w-44"}`}
              >
                <WheelColumn
                  dashboard={appearance === "dashboard"}
                  dimInactive
                  format={formatValue}
                  values={customUnit.values}
                  selected={currentValue}
                  onSelect={(next) => onChange?.(next)}
                />
                <WheelColumn
                  dashboard={appearance === "dashboard"}
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
              </motion.div>
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
                    dashboard={appearance === "dashboard"}
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
