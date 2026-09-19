import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type TextBoxProps = {
  inlineLabel?: boolean;
  label?: string;
  subLabel?: string;
  type?: string;
  icon?: ReactNode;
  labelClasses?: string;
  classes?: string;
  placeHolder: string;
  localizePhoneNumber?: boolean;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const TextBox = ({
  inlineLabel,
  label,
  subLabel,
  type = "text",
  icon,
  labelClasses,
  classes,
  placeHolder,
  localizePhoneNumber,
  onChange,
  onBlur,
  error,
  ...props
}: TextBoxProps) => {
  const toPersianDigits = (value: string) =>
    value
      .replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])
      .replace(/[٠-٩]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"["٠١٢٣٤٥٦٧٨٩".indexOf(digit)]);

  const toEnglishDigits = (value: string) =>
    value
      .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
      .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

  const shouldLocalize = type === "number" || localizePhoneNumber;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!shouldLocalize) {
      onChange?.(e);
      return;
    }
    const input = e.currentTarget;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    const englishValue = toEnglishDigits(input.value);
    const persianValue = toPersianDigits(englishValue);
    input.value = englishValue;
    onChange?.(e);

    input.value = persianValue;

    if (selectionStart !== null && selectionEnd !== null) {
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (!shouldLocalize) {
      onBlur?.(e);
      return;
    }
    const input = e.currentTarget;
    const englishValue = toEnglishDigits(input.value);
    const persianValue = toPersianDigits(englishValue);
    input.value = englishValue;
    onBlur?.(e);

    input.value = persianValue;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1.5">
      <div
        className={`flex ${
          inlineLabel ? "flex-row" : "flex-col gap-1"
        } items-center w-full select-none`}
      >
        {label && (
          <div
            className={`w-full flex flex-col justify-center items-center ${
              inlineLabel && "flex-1"
            } ${subLabel ? "mb-1" : "mb-0"}`}
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
          className={`${classes} ${
            inlineLabel && "flex-2"
          } bg-darker-blue-400 text-[#FCFCFC] h-12 desktop:h-14 flex flex-row w-full items-center justify-between rounded-2xl border border-darker-blue-100 ${
            error && "border-red-400!"
          } group focus-within:border-blue-900`}
        >
          {icon && (
            <span className="px-1 pr-3 text-xl desktop:text-2xl text-text-input">
              {icon}
            </span>
          )}

          <input
            id={props.name}
            type={type === "number" ? "text" : type}
            inputMode={type === "number" ? "numeric" : undefined}
            placeholder={
              shouldLocalize ? toPersianDigits(placeHolder) : placeHolder
            }
            autoComplete="off"
            className="ios-textbox flex-1 w-full h-full px-3 bg-transparent rounded-xl font-medium font-peyda outline-none text-base"
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>

      {error && (
        <small className="text-red-400 self-end text-xs font-peyda ml-2">
          {error}
        </small>
      )}
    </div>
  );
};

export default TextBox;
