import type { InputHTMLAttributes, ReactNode } from "react";

type TextBoxProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  icon?: ReactNode;
  classes?: string;
  placeHolder: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextBox = ({
  inlineLabel,
  label,
  subLabel,
  icon,
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
            className={`flex w-full ${inlineLabel && "flex-1 flex-col items-center justify-start mb-0!"} flex-row ${subLabel ? "mb-1" : "mb-0"}`}
          >
            <div className="flex flex-col justify-center items-center">
              <label
                htmlFor={props.name}
                className="shrink-0 text-xl font-yekan font-extrabold self-start text-white"
              >
                {label}
              </label>
              {subLabel && (
                <small className="font-peyda text-xs font-medium self-start text-blue-500">
                  {subLabel}
                </small>
              )}
            </div>
            {error && !inlineLabel && (
              <small className="text-red-500 text-xs font-peyda self-end mr-auto ml-1">
                {error}
              </small>
            )}
          </div>
        )}
        <div
          className={`${classes} ${inlineLabel && "flex-2"} bg-darker-blue-400 h-12 desktop:h-14 flex flex-row w-full items-center justify-between rounded-2xl border border-darker-blue-100 group focus-within:border-blue-900`}
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
            className="flex-1 w-full h-full px-4 bg-transparent text-blue-900 rounded-xl font-medium font-peyda outline-none text-sm"
            {...props}
          />
        </div>
        {!label && error && (
          <small className="text-red-500 self-start text-xs font-peyda mr-2 mt-1">
            {error}
          </small>
        )}
      </div>
      {inlineLabel && error && (
        <small className="text-red-500 self-end text-xs font-peyda ml-2">
          {error}
        </small>
      )}
    </div>
  );
};

export default TextBox;
