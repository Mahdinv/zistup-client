import type { ReactNode } from "react";

type ButtonProps = {
  classes: string;
  icon?: ReactNode;
  iconClasses?: string;
  iconFirst?: boolean;
  itemsGap?: number;
  type?: "button" | "submit" | "reset";
  title?: string;
  name?: string;
  value?: string;
  disable?: boolean;
  onClick?: () => void;
};

const Button = ({
  classes,
  icon,
  iconClasses,
  iconFirst,
  itemsGap,
  type,
  title,
  name,
  value,
  disable,
  onClick,
}: ButtonProps) => {
  return (
    <>
      <button
        type={type}
        className={`w-full ${classes} compact:text-xs mobile:text-base fold:text-lg desktop:text-xl duration-300 py-1 px-4 outline-none select-none laptop:cursor-pointer`}
        onClick={onClick}
        disabled={disable}
        name={name}
        value={value}
      >
        <div
          className={`w-full flex ${
            iconFirst ? "flex-row-reverse" : "flex-row"
          } ${
            itemsGap === 0 || itemsGap === undefined
              ? "justify-between"
              : "justify-center"
          } items-center`}
          style={{ gap: itemsGap }}
        >
          {title && (
            <div className={`mt-1 ${!icon ? "grow" : "grow-0"}`}>{title}</div>
          )}
          <span className={`${iconClasses} self-center`}>{icon}</span>
        </div>
      </button>
    </>
  );
};

export default Button;
