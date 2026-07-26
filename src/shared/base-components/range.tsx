import React, { type ChangeEvent } from "react";

type RangeProps = {
  options: {
    title: string;
    value: string | number;
  }[];
  min: number;
  max: number;
  step: number;
  initialValue: number;
  value: string | number;
  onChange: (value: string | number) => void;
  error?: string;
};

const Range = ({
  options,
  min,
  max,
  step,
  initialValue,
  value,
  onChange,
  error,
}: RangeProps) => {
  const valueIndex = React.useMemo(() => {
    const safeInitialValue = Math.min(
      Math.max(initialValue, 0),
      Math.max(options.length - 1, 0),
    );

    if (value === "" || value == null) {
      return safeInitialValue;
    }

    const index = options.findIndex((option) => option.value === value);

    return index !== -1 ? index : safeInitialValue;
  }, [value, options, initialValue]);

  if (options.length === 0) {
    return null;
  }

  const progress =
    options.length > 1 ? (valueIndex / (options.length - 1)) * 100 : 100;

  const sliderValue = min + valueIndex * step;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sliderPosition = Number(event.target.value);

    const index = Math.round((sliderPosition - min) / step);

    const safeIndex = Math.min(Math.max(index, 0), options.length - 1);

    const selectedOption = options[safeIndex];

    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {error && (
        <small className="self-start mr-2 mt-1 font-peyda text-red-500">
          {error}
        </small>
      )}
      <div
        dir="ltr"
        className="w-full flex flex-row justify-center items-center gap-3"
      >
        <label className="font-peyda text-xs font-bold">کم</label>
        <div className="relative h-8 w-full">
          <div className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-darker-blue-100">
            <div
              className="h-full rounded-full bg-blue-400 transition-all duration-200"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
            {options.map((option, index) => {
              const isActive = index <= valueIndex;
              const isSelected = index === valueIndex;

              return (
                <span
                  key={`${option.value}-${index}`}
                  className={[
                    "relative z-10 flex h-2 w-2 items-center justify-center",
                    "rounded-full border-2 transition-all duration-200",
                    isActive
                      ? "border-blue-400 bg-blue-400"
                      : "bg-darker-blue-100 border-darker-blue-100",
                    isSelected ? "h-3 w-3" : "",
                  ].join(" ")}
                ></span>
              );
            })}
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={sliderValue}
            aria-label="انتخاب مقدار"
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
            style={{
              direction: "ltr",
            }}
            onChange={handleChange}
          />
        </div>
        <label className="font-peyda text-xs font-bold">زیاد</label>
      </div>
    </div>
  );
};

export default Range;
