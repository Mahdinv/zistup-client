import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type { KeenSliderInstance } from "keen-slider";
import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";

import {
  JALALI_MONTHS,
  createRange,
  getJalaliMonthDays,
  getTodayJalali,
  gregorianToJalali,
  isSameJalaliDate,
  jalaliToGregorian,
  toPersianNumber,
  type JalaliDate,
} from "../lib/birth-date.utils";

const cn = (...classes: Array<string | false | null | undefined>): string => {
  return classes.filter(Boolean).join(" ");
};

type WheelItem = {
  value: number;
  label: string;
};

type WheelVariant = "number" | "month";

type WheelColumnProps = {
  items: readonly WheelItem[];
  value: number;
  label: string;
  variant: WheelVariant;
  onChange: (value: number) => void;
  disabled?: boolean;
  loop?: boolean;
};

type WheelOptionProps = {
  id: string;
  item: WheelItem;
  index: number;
  active: boolean;
  disabled: boolean;
  variant: WheelVariant;
  onSelect: (index: number) => void;
};

const easeOutCubic = (time: number): number => {
  return 1 - Math.pow(1 - time, 3);
};

const WheelOption = memo(function WheelOption({
  id,
  item,
  index,
  active,
  disabled,
  variant,
  onSelect,
}: WheelOptionProps) {
  const isNumber = variant === "number";

  const scale = active ? 1 : isNumber ? 0.84 : 0.94;

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      onClick={() => {
        onSelect(index);
      }}
      className={cn(
        "keen-slider__slide",
        "relative flex min-w-0",
        "items-center justify-center",
        "overflow-visible!",

        active ? "z-20" : "z-0",

        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
      )}
    >
      <div
        className={cn(
          "flex h-full w-full",
          "items-center justify-center",
          "overflow-visible",
        )}
      >
        <span
          dir="rtl"
          className={cn(
            "inline-flex h-8",
            "items-center justify-center",

            "overflow-visible",
            "whitespace-nowrap",
            "text-center",

            "will-change-[transform,opacity]",
            "transition-[transform,opacity]",
            "duration-150 ease-out",

            "origin-[center_center]",

            isNumber
              ? [
                  "font-rokh",
                  "text-[24px]",
                  active ? "font-semibold" : "font-medium",
                  "leading-none",
                ].join(" ")
              : [
                  "font-peyda",

                  /*
                   * مقدار ماه از 16px به 18px تغییر کرده است.
                   */
                  "text-[18px]",

                  active ? "font-medium" : "font-normal",

                  "leading-none",
                ].join(" "),
          )}
          style={{
            /*
             * این جابه‌جایی برای تمام آیتم‌ها یکسان است؛
             * بنابراین ترتیب و تراز عمودی به‌هم نمی‌ریزد.
             */
            transform: `translateY(2px) scale(${scale})`,

            opacity: active ? 1 : 0.72,
          }}
        >
          {/*
            متن‌ها روی یک Grid مشترک قرار گرفته‌اند تا
            لایه گرادیان هیچ تأثیری روی اندازه یا موقعیت نداشته باشد.
          */}
          <span className="grid place-items-center">
            {/* متن اصلی */}
            <span
              className={cn(
                "col-start-1 row-start-1",
                "inline-flex items-center justify-center",

                active ? "text-white" : isNumber ? "text-white" : "text-white",
              )}
            >
              {item.label}
            </span>

            {/*
              گرادیان فقط برای اعداد انتخاب‌نشده
              یعنی ستون روز و سال نمایش داده می‌شود.

              بالا: #1B1A2000
              پایین: #1B1A20
            */}
            {!active && isNumber && (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none",
                  "col-start-1 row-start-1",

                  "inline-flex",
                  "items-center justify-center",

                  "text-transparent",
                )}
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #1B1A2000 0%, #1B1A20 100%)",

                  backgroundClip: "text",

                  WebkitBackgroundClip: "text",

                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.label}
              </span>
            )}
          </span>
        </span>
      </div>
    </div>
  );
});

const WheelColumn = memo(function WheelColumn({
  items,
  value,
  label,
  variant,
  onChange,
  disabled = false,
  loop = true,
}: WheelColumnProps) {
  const id = useId();

  const itemsRef = useRef(items);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  const wasDraggedRef = useRef(false);

  const settleTimeoutRef = useRef<number | null>(null);

  const resetDragTimeoutRef = useRef<number | null>(null);

  itemsRef.current = items;
  valueRef.current = value;
  onChangeRef.current = onChange;

  const selectedIndex = Math.max(
    0,
    items.findIndex((item) => item.value === value),
  );

  const selectedIndexRef = useRef(selectedIndex);

  selectedIndexRef.current = selectedIndex;

  const initialIndexRef = useRef(selectedIndex);

  /*
   * فقط ظاهر گزینه فعال را مدیریت می‌کند.
   * تغییر این state باعث اجرای onChange فرم نمی‌شود.
   */
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const activeIndexRef = useRef(activeIndex);

  activeIndexRef.current = activeIndex;

  const clearSettleTimeout = useCallback((): void => {
    if (settleTimeoutRef.current === null) {
      return;
    }

    window.clearTimeout(settleTimeoutRef.current);

    settleTimeoutRef.current = null;
  }, []);

  /*
   * مقدار فقط بعد از توقف کامل Slider ثبت می‌شود.
   */
  const commitSettledValue = useCallback((slider: KeenSliderInstance): void => {
    if (slider.animator.active) {
      return;
    }

    const finalIndex = slider.track.details?.rel ?? 0;

    const finalItem = itemsRef.current[finalIndex];

    if (!finalItem) {
      return;
    }

    activeIndexRef.current = finalIndex;

    setActiveIndex((previousIndex) => {
      return previousIndex === finalIndex ? previousIndex : finalIndex;
    });

    if (finalItem.value === valueRef.current) {
      return;
    }

    valueRef.current = finalItem.value;

    onChangeRef.current(finalItem.value);
  }, []);

  const scheduleFallbackCommit = useCallback(
    (slider: KeenSliderInstance): void => {
      clearSettleTimeout();

      settleTimeoutRef.current = window.setTimeout(() => {
        settleTimeoutRef.current = null;

        if (slider.animator.active) {
          return;
        }

        commitSettledValue(slider);
      }, 90);
    },
    [clearSettleTimeout, commitSettledValue],
  );

  const canLoop = loop && items.length > 3;

  const sliderOptions = useMemo(
    () => ({
      vertical: true,

      loop: canLoop,

      mode: "snap" as const,

      drag: !disabled,

      dragSpeed: 0.72,

      rubberband: false,

      renderMode: "precision" as const,

      initial: initialIndexRef.current,

      slides: {
        perView: 3,
        origin: "center" as const,
        spacing: 0,
      },

      ...(canLoop
        ? {}
        : {
            range: {
              min: 0,
              max: Math.max(0, items.length - 1),
              align: false,
            },
          }),

      defaultAnimation: {
        duration: 280,
        easing: easeOutCubic,
      },

      created(slider: KeenSliderInstance) {
        const index = slider.track.details?.rel ?? initialIndexRef.current;

        activeIndexRef.current = index;
        setActiveIndex(index);
      },

      /*
       * فقط ظاهر گزینه فعال تغییر می‌کند.
       * onChange فرم اینجا اجرا نمی‌شود.
       */
      slideChanged(slider: KeenSliderInstance) {
        const index = slider.track.details?.rel ?? 0;

        if (activeIndexRef.current === index) {
          return;
        }

        activeIndexRef.current = index;

        setActiveIndex(index);
      },

      dragStarted() {
        wasDraggedRef.current = true;

        clearSettleTimeout();

        if (resetDragTimeoutRef.current !== null) {
          window.clearTimeout(resetDragTimeoutRef.current);
        }
      },

      dragEnded(slider: KeenSliderInstance) {
        scheduleFallbackCommit(slider);

        resetDragTimeoutRef.current = window.setTimeout(() => {
          wasDraggedRef.current = false;
        }, 120);
      },

      /*
       * مسیر اصلی اجرای onChange:
       * فقط پس از پایان کامل حرکت.
       */
      animationEnded(slider: KeenSliderInstance) {
        clearSettleTimeout();

        commitSettledValue(slider);
      },
    }),
    [
      canLoop,
      clearSettleTimeout,
      commitSettledValue,
      disabled,
      items.length,
      scheduleFallbackCommit,
    ],
  );

  const [sliderRef, sliderInstanceRef] =
    useKeenSlider<HTMLDivElement>(sliderOptions);

  const itemsKey = useMemo(() => {
    return items.map((item) => item.value).join("-");
  }, [items]);

  const previousItemsKeyRef = useRef(itemsKey);

  useEffect(() => {
    const slider = sliderInstanceRef.current;

    if (!slider) {
      return;
    }

    if (previousItemsKeyRef.current === itemsKey) {
      return;
    }

    previousItemsKeyRef.current = itemsKey;

    const maximumIndex = Math.max(0, itemsRef.current.length - 1);

    const safeIndex = Math.min(selectedIndexRef.current, maximumIndex);

    activeIndexRef.current = safeIndex;

    setActiveIndex(safeIndex);

    slider.update(undefined, safeIndex);
  }, [itemsKey, sliderInstanceRef]);

  /*
   * هماهنگی Slider با مقدار خارجی مانند reset فرم
   * یا مقدار دریافتی از سرور.
   */
  useEffect(() => {
    const slider = sliderInstanceRef.current;

    if (!slider) {
      return;
    }

    const currentIndex = slider.track.details?.rel;

    activeIndexRef.current = selectedIndex;

    setActiveIndex(selectedIndex);

    if (currentIndex === selectedIndex) {
      return;
    }

    slider.moveToIdx(selectedIndex, false, {
      duration: 0,
    });
  }, [selectedIndex, sliderInstanceRef]);

  useEffect(() => {
    return () => {
      clearSettleTimeout();

      if (resetDragTimeoutRef.current !== null) {
        window.clearTimeout(resetDragTimeoutRef.current);
      }
    };
  }, [clearSettleTimeout]);

  /*
   * انتخاب با کلیک.
   * مقدار فرم بعد از animationEnded تغییر می‌کند.
   */
  const moveToIndex = useCallback(
    (index: number): void => {
      if (disabled || wasDraggedRef.current) {
        return;
      }

      const slider = sliderInstanceRef.current;

      if (!slider) {
        return;
      }

      const safeIndex = Math.max(
        0,
        Math.min(index, itemsRef.current.length - 1),
      );

      const currentIndex = slider.track.details?.rel;

      if (currentIndex === safeIndex) {
        commitSettledValue(slider);

        return;
      }

      slider.moveToIdx(safeIndex, false, {
        duration: 240,
        easing: easeOutCubic,
      });
    },
    [commitSettledValue, disabled, sliderInstanceRef],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) {
      return;
    }

    const slider = sliderInstanceRef.current;

    if (!slider) {
      return;
    }

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        slider.prev();
        break;

      case "ArrowDown":
        event.preventDefault();
        slider.next();
        break;

      case "Home":
        event.preventDefault();
        moveToIndex(0);
        break;

      case "End":
        event.preventDefault();
        moveToIndex(items.length - 1);
        break;
    }
  };

  return (
    <div
      ref={sliderRef}
      dir="ltr"
      role="listbox"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      aria-activedescendant={`${id}-${activeIndex}`}
      onKeyDown={handleKeyDown}
      className={cn(
        "keen-slider",
        "relative z-20 h-full min-w-0",

        "overflow-hidden",
        "select-none outline-none",

        "touch-pan-x",

        disabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",

        "focus-visible:ring-2",
        "focus-visible:ring-inset",
        "focus-visible:ring-white/10",
      )}
    >
      {items.map((item, index) => (
        <WheelOption
          key={item.value}
          id={`${id}-${index}`}
          item={item}
          index={index}
          active={index === activeIndex}
          disabled={disabled}
          variant={variant}
          onSelect={moveToIndex}
        />
      ))}
    </div>
  );
});

export type BirthDatePickerProps = {
  value?: string | null;

  onChange: (value: string) => void;

  onBlur?: () => void;

  label?: string;
  error?: string;
  disabled?: boolean;

  minYear?: number;
  maxYear?: number;
};

export const BirthDatePicker = forwardRef<HTMLDivElement, BirthDatePickerProps>(
  function BirthDatePicker(
    {
      value,
      onChange,
      onBlur,
      label = "تاریخ تولد",
      error,
      disabled = false,
      minYear,
      maxYear,
    },
    ref,
  ) {
    const id = useId();

    const todayJalali = useMemo(() => getTodayJalali(), []);

    const maximumYear = Math.min(maxYear ?? todayJalali.year, todayJalali.year);

    const minimumYear = Math.min(minYear ?? maximumYear - 120, maximumYear);

    const fallbackDate = useMemo<JalaliDate>(
      () => ({
        year: Math.max(minimumYear, maximumYear - 25),
        month: todayJalali.month,
        day: todayJalali.day,
      }),
      [maximumYear, minimumYear, todayJalali.day, todayJalali.month],
    );

    const normalizePickerDate = useCallback(
      (date: JalaliDate): JalaliDate => {
        const year = Math.min(maximumYear, Math.max(minimumYear, date.year));

        const maximumMonth = year === todayJalali.year ? todayJalali.month : 12;

        const month = Math.min(maximumMonth, Math.max(1, date.month));

        const monthDays = getJalaliMonthDays(year, month);

        const maximumDay =
          year === todayJalali.year && month === todayJalali.month
            ? Math.min(monthDays, todayJalali.day)
            : monthDays;

        const day = Math.min(maximumDay, Math.max(1, date.day));

        return {
          year,
          month,
          day,
        };
      },
      [
        maximumYear,
        minimumYear,
        todayJalali.day,
        todayJalali.month,
        todayJalali.year,
      ],
    );

    const getPickerDate = useCallback(
      (gregorianValue?: string | null): JalaliDate => {
        const convertedDate = gregorianToJalali(gregorianValue);

        return normalizePickerDate(convertedDate ?? fallbackDate);
      },
      [fallbackDate, normalizePickerDate],
    );

    const [selectedDate, setSelectedDate] = useState<JalaliDate>(() => {
      return getPickerDate(value);
    });

    const selectedDateRef = useRef<JalaliDate>(selectedDate);

    useEffect(() => {
      const nextDate = getPickerDate(value);

      if (isSameJalaliDate(selectedDateRef.current, nextDate)) {
        return;
      }

      selectedDateRef.current = nextDate;

      setSelectedDate(nextDate);
    }, [getPickerDate, value]);

    const updateDate = useCallback(
      (changes: Partial<JalaliDate>): void => {
        const nextDate = normalizePickerDate({
          ...selectedDateRef.current,
          ...changes,
        });

        if (isSameJalaliDate(selectedDateRef.current, nextDate)) {
          return;
        }

        selectedDateRef.current = nextDate;

        setSelectedDate(nextDate);

        onChange(jalaliToGregorian(nextDate));
      },
      [normalizePickerDate, onChange],
    );

    const selectedYear = selectedDate.year;

    const selectedMonth = selectedDate.month;

    const maximumMonth =
      selectedYear === todayJalali.year ? todayJalali.month : 12;

    const monthItems = useMemo<WheelItem[]>(
      () =>
        JALALI_MONTHS.slice(0, maximumMonth).map((month, index) => ({
          value: index + 1,
          label: month,
        })),
      [maximumMonth],
    );

    const maximumDay = useMemo(() => {
      const monthDays = getJalaliMonthDays(selectedYear, selectedMonth);

      const isCurrentMonth =
        selectedYear === todayJalali.year &&
        selectedMonth === todayJalali.month;

      return isCurrentMonth ? Math.min(monthDays, todayJalali.day) : monthDays;
    }, [
      selectedMonth,
      selectedYear,
      todayJalali.day,
      todayJalali.month,
      todayJalali.year,
    ]);

    const dayItems = useMemo<WheelItem[]>(
      () =>
        createRange(1, maximumDay).map((day) => ({
          value: day,
          label: toPersianNumber(day),
        })),
      [maximumDay],
    );

    const yearItems = useMemo<WheelItem[]>(
      () =>
        createRange(minimumYear, maximumYear).map((year) => ({
          value: year,
          label: toPersianNumber(year),
        })),
      [maximumYear, minimumYear],
    );

    const handleBlurCapture = (event: FocusEvent<HTMLDivElement>): void => {
      const nextFocusedElement = event.relatedTarget as Node | null;

      const focusIsStillInside =
        nextFocusedElement && event.currentTarget.contains(nextFocusedElement);

      if (!focusIsStillInside) {
        onBlur?.();
      }
    };

    const labelId = `${id}-label`;
    const errorId = `${id}-error`;

    return (
      <div dir="rtl" className="w-full">
        <span id={labelId} className="mb-2 block text-lg font-bold text-white">
          {label}
        </span>

        <div
          ref={ref}
          tabIndex={-1}
          role="group"
          aria-labelledby={labelId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onBlurCapture={handleBlurCapture}
          className={cn(
            "relative isolate grid",

            "h-15.5 w-full",

            "grid-cols-[0.9fr_1.3fr_1.1fr]",

            "overflow-hidden",
            "rounded-2xl",

            "border border-[#303641]",
            "bg-[#191A20]",

            "shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]",

            "outline-none",

            "transition-[border-color,box-shadow,opacity]",
            "duration-200",

            "focus-within:border-[#566170]",
            "focus-within:ring-[3px]",
            "focus-within:ring-white/4",

            error && "border-red-500 focus-within:border-red-500",

            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <WheelColumn
            label="روز تولد"
            variant="number"
            items={dayItems}
            value={selectedDate.day}
            disabled={disabled}
            onChange={(day) => {
              updateDate({ day });
            }}
          />

          <WheelColumn
            label="ماه تولد"
            variant="month"
            items={monthItems}
            value={selectedDate.month}
            disabled={disabled}
            onChange={(month) => {
              updateDate({ month });
            }}
          />

          <WheelColumn
            label="سال تولد"
            variant="number"
            items={yearItems}
            value={selectedDate.year}
            disabled={disabled}
            loop={false}
            onChange={(year) => {
              updateDate({ year });
            }}
          />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 px-2 text-sm font-medium text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
