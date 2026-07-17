import type { InputHTMLAttributes, ReactNode } from "react";

type TextBoxProps = {
  label?: string;
  subLabel?: string;
  icon?: ReactNode;
  classes?: string;
  placeHolder: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextBox = ({
  label,
  subLabel,
  icon,
  classes,
  placeHolder,
  error,
  ...props
}: TextBoxProps) => {
  return (
    <div className="flex flex-col items-center gap-1 w-full select-none">
      {label && (
        <div className="flex flex-col items-start w-full mb-1 justify-center">
          <label
            htmlFor={props.name}
            className="shrink-0 text-xl font-yekan font-extrabold self-start text-white"
          >
            {label}
          </label>
          {subLabel && (
            <small className="font-peyda text-xs font-medium text-blue-500">
              {subLabel}
            </small>
          )}
        </div>
      )}
      <div
        className={`${classes} h-12 desktop:h-14 flex flex-row w-full items-center justify-between rounded-2xl border border-darker-blue-100 group focus-within:border-blue-900`}
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
          className="flex-1 w-full h-full px-4 bg-transparent text-blue-900 rounded-xl font-medium font-peyda outline-none compact:text-sm laptop:text-sm"
          {...props}
        />
      </div>
      {error && (
        <small className="text-red-500 self-start font-peyda mr-2 mt-1">
          {error}
        </small>
      )}
    </div>
  );
};

export default TextBox;
