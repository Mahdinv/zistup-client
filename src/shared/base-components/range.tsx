import React, { type ChangeEvent } from "react";

type RangeProps = {
  options: {
    title: string;
    value: string | number;
  }[];
  initialValue?: string | number;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
  error?: string;
};

const Range = ({
  options,
  initialValue,
  value,
  onChange,
  error,
}: RangeProps) => {
  const valueIndex = React.useMemo(() => {
    if (!options.length) {
      return 0;
    }

    const currentValue = value ?? initialValue;

    const index = options.findIndex((option) => option.value === currentValue);

    return index !== -1 ? index : 0;
  }, [value, initialValue, options]);

  if (options.length === 0) {
    return null;
  }

  const progress =
    options.length > 1 ? (valueIndex / (options.length - 1)) * 100 : 100;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value);

    const selectedOption = options[index];

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
        <label className="font-peyda compact:text-xs fold:text-sm laptop:text-base font-bold">
          کم
        </label>

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
                />
              );
            })}
          </div>

          <input
            type="range"
            min={0}
            max={options.length - 1}
            step={1}
            value={valueIndex}
            aria-label="انتخاب مقدار"
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
            style={{
              direction: "ltr",
            }}
            onChange={handleChange}
          />
        </div>

        <label className="font-peyda compact:text-xs fold:text-sm laptop:text-base font-bold">
          زیاد
        </label>
      </div>
    </div>
  );
};

export default Range;
