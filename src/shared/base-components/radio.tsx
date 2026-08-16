import type { ReactNode } from "react";

type RadioProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  labelClasses?: string;
  gridClasses: string;
  variant: "green" | "blue";
  options: { title: string; value: string | number; icon?: ReactNode }[];
  value: string | number | undefined;
  error?: string;
  onChange: (value: string | number | undefined) => void;
};

const variantStyles = {
  blue: {
    selected:
      "border border-blue-400 ring-1 ring-inset ring-blue-400 bg-[#3C3946] text-blue-400",
    unselected: "border border-blue-900 bg-darker-blue-400 text-blue-500",
  },
  green: {
    selected: "border border-green-900 bg-green-950 text-green-100",
    unselected: "border border-green-950 bg-darker-blue-400 text-green-500",
  },
};

const Radio = ({
  inlineLabel,
  label,
  subLabel,
  labelClasses,
  gridClasses,
  variant = "blue",
  options,
  value,
  error,
  onChange,
}: RadioProps) => {
  const style = variantStyles[variant];

  return (
    <div className="w-full flex flex-col justify-start items-center gap-1.5">
      <div
        className={`w-full flex ${inlineLabel ? "flex-row" : "flex-col gap-1"} justify-center`}
      >
        {label && (
          <label
            className={`${labelClasses} ${inlineLabel && "flex-1 self-center!"} w-full text-xl font-yekan font-extrabold self-start text-white`}
          >
            {label}
            {subLabel && (
              <small className="font-peyda text-sm font-medium self-start mr-1">
                {subLabel}
              </small>
            )}
          </label>
        )}
        <div className={`${inlineLabel && "flex-2"} grid ${gridClasses}`}>
          {options.map((option) => {
            const selected = value === option.value;
            return (
              <div
                key={option.value}
                onClick={() => onChange(option.value)}
                className={`w-full flex flex-row justify-center items-center gap-1 duration-300 transition-all rounded-xl compact:py-2.5 mobile:py-3 mobile-lg:py-3.5 cursor-pointer ${selected ? style.selected : style.unselected}`}
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

export default Radio;
