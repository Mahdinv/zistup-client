import type { ReactNode } from "react";

type RadioProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  gridClasses: string;
  options: { title: string; value: string; icon?: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

const Radio = ({
  inlineLabel,
  label,
  subLabel,
  gridClasses,
  options,
  value,
  onChange,
  error,
}: RadioProps) => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-1.5">
      <div
        className={`w-full flex ${inlineLabel ? "flex-row" : "flex-col gap-1"} justify-center`}
      >
        {label && (
          <div
            className={`${inlineLabel && "flex-1 self-center!"} w-full flex flex-row items-center justify-start`}
          >
            <label className="text-xl font-yekan font-extrabold self-start text-white">
              {label}
              {subLabel && (
                <small className="font-peyda text-sm font-medium self-start mr-1">
                  {subLabel}
                </small>
              )}
            </label>
            {error && !inlineLabel && (
              <small className="text-red-500 text-xs font-peyda self-end mr-auto ml-1">
                {error}
              </small>
            )}
          </div>
        )}
        <div className={`${inlineLabel && "flex-2"} grid ${gridClasses}`}>
          {options.map((option) => {
            const selected = value === option.value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  const finalValue = option.value !== value ? option.value : "";
                  onChange(finalValue);
                }}
                className={`w-full flex flex-row justify-center items-center gap-1 duration-300 transition-all rounded-xl compact:py-2.5 mobile:py-3 mobile-lg:py-3.5 cursor-pointer ${
                  selected
                    ? "border-2 border-blue-400 bg-[#3C3946] text-blue-400"
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
      {error && ((label && inlineLabel) || !label) && (
        <small className="text-red-500 self-end text-xs font-peyda ml-2">
          {error}
        </small>
      )}
    </div>
  );
};

export default Radio;
