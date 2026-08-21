import {
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

type OtpBoxProps = {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  length?: number;
  phoneNumber?: string;
  disabled?: boolean;
};

const getDigits = (value: string) => value.replace(/\D/g, "");

const OtpBox = ({
  value = "",
  onChange,
  onBlur,
  error,
  length = 4,
  phoneNumber,
  disabled = false,
}: OtpBoxProps) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const values = Array.from({ length }, (_, index) => value[index] ?? "");

  const focusInput = (index: number) => {
    requestAnimationFrame(() => {
      inputsRef.current[index]?.focus();
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const enteredValue = getDigits(event.currentTarget.value);

    if (enteredValue.length > 1) {
      const otp = enteredValue.slice(0, length);

      onChange(otp);

      if (otp.length < length) {
        focusInput(otp.length);
      } else {
        inputsRef.current[length - 1]?.blur();
      }

      return;
    }

    if (!enteredValue) {
      onChange(value.slice(0, index));
      return;
    }

    const updatedValues = [...values];

    updatedValues[index] = enteredValue;

    onChange(updatedValues.join("").slice(0, length));

    if (index < length - 1) {
      focusInput(index + 1);
    } else {
      inputsRef.current[index]?.blur();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key !== "Backspace" || value[index] || index === 0) {
      return;
    }

    event.preventDefault();

    onChange(value.slice(0, index - 1));
    focusInput(index - 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedValue = getDigits(event.clipboardData.getData("text")).slice(
      0,
      length,
    );

    if (!pastedValue) return;

    onChange(pastedValue);

    if (pastedValue.length < length) {
      focusInput(pastedValue.length);
    } else {
      inputsRef.current[length - 1]?.blur();
    }
  };

  return (
    <div dir="ltr" className="flex w-full flex-col items-end gap-3">
      <div dir="rtl" className="flex w-full flex-col items-start gap-1">
        <label className="font-yekan compact:text-xl laptop:text-2xl font-extrabold text-white">
          کد تأیید را وارد کنید
        </label>

        {phoneNumber && (
          <p className="font-peyda compact:text-base laptop:text-lg text-blue-500">
            کد تأیید را به شماره {phoneNumber} ارسال کردیم
          </p>
        )}
      </div>

      <div
        className="flex w-full items-center justify-center gap-3"
        onBlur={(event) => {
          const nextElement = event.relatedTarget as Node | null;

          if (!nextElement || !event.currentTarget.contains(nextElement)) {
            onBlur?.();
          }
        }}
      >
        {values.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            autoFocus={index === 0}
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={`
              h-12 w-12
              rounded-2xl
              border
              bg-darker-blue-400
              text-center
              text-xl
              text-blue-800
              outline-none
              disabled:cursor-not-allowed
              disabled:opacity-50    
            `}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => handleChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
          />
        ))}
      </div>

      {error && (
        <span className="w-full text-center font-peyda text-sm text-red-500">
          {error}
        </span>
      )}
    </div>
  );
};

export default OtpBox;
