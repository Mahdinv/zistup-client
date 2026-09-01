import { useEffect, useRef } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";

type NumberCounterProps = {
  label?: string;
  labelClasses?: string;
  suffix?: string;
  suffixClasses?: string;
  valueClasses?: string;
  wrapperClasses?: string;
  counterClasses?: string;
  controlsClasses?: string;
  plusButtonClasses?: string;
  minusButtonClasses?: string;
  plusIconClasses?: string;
  minusIconClasses?: string;
  value: number | undefined;
  min?: number;
  max?: number;
  step?: number;
  holdDelay?: number;
  initialRepeatDelay?: number;
  minRepeatDelay?: number;
  acceleration?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

const NumberCounter = ({
  label,
  labelClasses = "",
  suffix,
  suffixClasses = "",
  valueClasses = "",
  wrapperClasses = "",
  counterClasses = "",
  controlsClasses = "",
  plusButtonClasses = "",
  minusButtonClasses = "",
  plusIconClasses = "",
  minusIconClasses = "",
  value,
  min = 0,
  max = 100,
  step = 1,
  holdDelay = 350,
  initialRepeatDelay = 140,
  minRepeatDelay = 45,
  acceleration = 0.88,
  disabled = false,
  onChange,
}: NumberCounterProps) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef<number | undefined>(value);
  const repeatDelayRef = useRef(initialRepeatDelay);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const stopChanging = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    repeatDelayRef.current = initialRepeatDelay;
  };

  const changeValue = (direction: 1 | -1) => {
    const currentValue = valueRef.current ?? min;
    const nextValue = Math.min(
      max,
      Math.max(min, currentValue + direction * step),
    );

    if (nextValue === currentValue) {
      stopChanging();
      return false;
    }

    valueRef.current = nextValue;
    onChange(nextValue);

    return true;
  };

  const repeatChange = (direction: 1 | -1) => {
    if (!changeValue(direction)) return;

    repeatDelayRef.current = Math.max(
      minRepeatDelay,
      repeatDelayRef.current * acceleration,
    );

    timeoutRef.current = setTimeout(() => {
      repeatChange(direction);
    }, repeatDelayRef.current);
  };

  const startChanging = (direction: 1 | -1) => {
    if (disabled) return;

    stopChanging();
    changeValue(direction);

    timeoutRef.current = setTimeout(() => {
      repeatDelayRef.current = initialRepeatDelay;
      repeatChange(direction);
    }, holdDelay);
  };

  useEffect(() => {
    return stopChanging;
  }, []);

  return (
    <div
      className={`flex flex-col justify-start items-start gap-1 shrink-0 ${wrapperClasses}`}
    >
      {label && (
        <label
          className={`text-xl font-yekan font-extrabold self-start text-white ${labelClasses}`}
        >
          {label}
        </label>
      )}

      <div
        className={`bg-darker-blue-400 rounded-2xl py-2 px-3 flex flex-row justify-between items-center ${counterClasses}`}
      >
        <button
          type="button"
          disabled={disabled}
          className={`bg-green-400 rounded-xxs p-2 cursor-pointer select-none touch-none disabled:cursor-not-allowed disabled:opacity-50 ${plusButtonClasses}`}
          onPointerDown={() => startChanging(1)}
          onPointerUp={stopChanging}
          onPointerLeave={stopChanging}
          onPointerCancel={stopChanging}
          onContextMenu={(e) => e.preventDefault()}
        >
          <PiPlusBold className={`text-black text-2xl ${plusIconClasses}`} />
        </button>

        <div
          className={`flex flex-row items-center justify-center gap-1 pt-1.5 w-[5.5rem] ${controlsClasses}`}
        >
          <label
            className={`text-green-400 text-8xl font-rokh tabular-nums text-center min-w-[3ch] ${valueClasses}`}
          >
            {value ?? ""}
          </label>
          {suffix && <span className={suffixClasses}>{suffix}</span>}
        </div>

        <button
          type="button"
          disabled={disabled}
          className={`bg-darker-blue-200 rounded-xxs p-2 cursor-pointer select-none touch-none disabled:cursor-not-allowed disabled:opacity-50 ${minusButtonClasses}`}
          onPointerDown={() => startChanging(-1)}
          onPointerUp={stopChanging}
          onPointerLeave={stopChanging}
          onPointerCancel={stopChanging}
          onContextMenu={(e) => e.preventDefault()}
        >
          <PiMinusBold className={`text-white text-2xl ${minusIconClasses}`} />
        </button>
      </div>
    </div>
  );
};

export default NumberCounter;
