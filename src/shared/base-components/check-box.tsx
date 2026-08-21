import type { ReactNode } from "react";

type CheckBoxProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  gridClasses: string;
  options: { title: string; value: string | number; icon?: ReactNode }[];
  values: (string | number)[];
  error?: string;
  onChange: (value: (string | number)[]) => void;
};

const CheckBox = ({
  inlineLabel,
  label,
  subLabel,
  gridClasses,
  options,
  values = [],
  error,
  onChange,
}: CheckBoxProps) => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-1.5">
      <div
        className={`w-full flex ${inlineLabel ? "flex-row" : "flex-col gap-1"} justify-center`}
      >
        {label && (
          <label
            className={`${inlineLabel && "flex-1 self-center!"} w-full compact:text-xl laptop:text-2xl font-yekan font-extrabold self-start text-white`}
          >
            {label}
            {subLabel && (
              <small className="font-peyda compact:text-base laptop:text-lg font-medium self-start mr-1">
                {subLabel}
              </small>
            )}
          </label>
        )}
        <div className={`${inlineLabel && "flex-2"} grid ${gridClasses}`}>
          {options.map((option) => {
            const selected = values.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={() => {
                  const finalValues = selected
                    ? values.filter((v) => v !== option.value)
                    : [...values, option.value];

                  onChange(finalValues);
                }}
                className={`w-full flex flex-row justify-center items-center gap-1 duration-300 transition-all rounded-xl compact:py-2.5 mobile:py-3 mobile-lg:py-3.5 cursor-pointer ${
                  selected
                    ? "border border-blue-400 ring-1 ring-inset ring-blue-400 bg-[#3C3946] text-blue-400"
                    : "border border-blue-900 bg-darker-blue-400 text-blue-500"
                }`}
              >
                {option.icon && option.icon}
                <label className="text-base font-medium font-peyda mt-auto">
                  {option.title}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      {error && (
        <small className="text-red-500 self-end text-xs font-peyda ml-2">
          {error}
        </small>
      )}
    </div>
  );
};

export default CheckBox;
