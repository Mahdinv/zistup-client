import type { InputHTMLAttributes, ReactNode } from "react";

type TextBoxProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  icon?: ReactNode;
  labelClasses?: string;
  classes?: string;
  placeHolder: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextBox = ({
  inlineLabel,
  label,
  subLabel,
  icon,
  labelClasses,
  classes,
  placeHolder,
  error,
  ...props
}: TextBoxProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-1.5">
      <div
        className={`flex ${inlineLabel ? "flex-row" : "flex-col gap-1"} items-center w-full select-none`}
      >
        {label && (
          <div
            className={`w-full flex flex-col justify-center items-center ${inlineLabel && "flex-1"} ${subLabel ? "mb-1" : "mb-0"}`}
          >
            <label
              htmlFor={props.name}
              className={`${labelClasses} shrink-0 compact:text-xl laptop:text-2xl font-yekan font-extrabold self-start text-white`}
            >
              {label}
            </label>
            {subLabel && (
              <small className="font-peyda compact:text-xs fold:text-sm laptop:text-base font-medium self-start text-blue-500">
                {subLabel}
              </small>
            )}
          </div>
        )}
        <div
          className={`${classes} ${inlineLabel && "flex-2"} bg-darker-blue-400 text-blue-900 h-12 desktop:h-14 flex flex-row w-full items-center justify-between rounded-2xl border border-darker-blue-100 group focus-within:border-blue-900`}
        >
          {icon && (
            <span className="px-1 pr-3 text-xl desktop:text-2xl text-text-input">
              {icon}
            </span>
          )}
          <input
            id={props.name}
            type="text"
            placeholder={placeHolder}
            autoComplete="off"
            className="flex-1 w-full h-full px-4 bg-transparent rounded-xl font-medium font-peyda outline-none text-base"
            {...props}
          />
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

export default TextBox;
