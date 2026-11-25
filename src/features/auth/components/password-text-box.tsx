import { useState, type ComponentProps } from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import TextBox from "@/shared/base-components/text-box";

type PasswordTextBoxProps = Omit<
  ComponentProps<typeof TextBox>,
  "type" | "icon"
>;

const PasswordTextBox = (props: PasswordTextBoxProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <TextBox
      {...props}
      type={visible ? "text" : "password"}
      icon={
        <button
          type="button"
          aria-label={`${visible ? "پنهان کردن" : "نمایش"} ${props.label ?? "رمز عبور"}`}
          aria-pressed={visible}
          aria-controls={props.id ?? props.name}
          className="flex size-6 cursor-pointer items-center justify-center rounded-sm text-4xl text-blue-900"
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? (
            <PiEyeClosedBold aria-hidden="true" />
          ) : (
            <PiEyeBold aria-hidden="true" />
          )}
        </button>
      }
    />
  );
};

export default PasswordTextBox;
