import { useEffect, useRef } from "react";
import { PiMinusBold, PiPlusBold } from "react-icons/pi";

type NumberCounterProps = {
  label?: string;
  labelClasses?: string;
  suffix?: string;
  suffixClasses: string;
  valueClasses?: string;
  value: number | undefined;
  onChange: (value: number) => void;
};

const NumberCounter = ({
  label,
  labelClasses,
  suffix,
  suffixClasses,
  valueClasses,
  value,
  onChange,
}: NumberCounterProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valueRef = useRef<number | undefined>(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const changeValue = (amount: number) => {
    const currentValue = valueRef.current ?? 0;

    const newValue = Math.min(100, Math.max(0, currentValue + amount));
    valueRef.current = newValue;
    onChange(newValue);
  };

  const startChanging = (amount: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    changeValue(amount);

    intervalRef.current = setInterval(() => {
      changeValue(amount);
    }, 150);
  };

  const stopChanging = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col justify-start items-start gap-1">
      {label && (
        <label
          className={`${labelClasses} text-xl font-yekan font-extrabold self-start text-white`}
        >
          {label}
        </label>
      )}

      <div className="w-full bg-darker-blue-400 rounded-2xl py-2 px-3 flex flex-row justify-between items-center">
        <div
          className="bg-darker-blue-200 rounded-xxs p-2 cursor-pointer select-none"
          onPointerDown={() => startChanging(-1)}
          onPointerUp={stopChanging}
          onPointerLeave={stopChanging}
          onPointerCancel={stopChanging}
          onContextMenu={(e) => e.preventDefault()}
        >
          <PiMinusBold className="text-white text-2xl" />
        </div>

        <div className="w-full flex flex-row items-center justify-center gap-1 pt-1.5">
          <label
            className={`${valueClasses} text-green-400 text-8xl font-rokh`}
          >
            {value ?? ""}
          </label>

          <span className={suffixClasses}>{suffix}</span>
        </div>

        <div
          className="bg-darker-blue-200 rounded-xxs p-2 cursor-pointer select-none"
          onPointerDown={() => startChanging(1)}
          onPointerUp={stopChanging}
          onPointerLeave={stopChanging}
          onPointerCancel={stopChanging}
          onContextMenu={(e) => e.preventDefault()}
        >
          <PiPlusBold className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default NumberCounter;
