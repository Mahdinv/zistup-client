import type { ReactNode } from "react";

type ButtonProps = {
  classes: string;
  icon?: ReactNode;
  iconClasses?: string;
  iconFirst?: boolean;
  itemsGap?: number;
  type?: "button" | "submit" | "reset";
  title?: string;
  itemCount?: number;
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
  type = "button",
  title,
  itemCount,
  name,
  value,
  disable,
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`relative ${
        title ? "w-full" : "w-fit"
      } ${classes} compact:text-xs mobile:text-base fold:text-lg desktop:text-xl duration-300 py-1 ${
        title ? "px-4" : "px-2"
      } outline-none select-none laptop:cursor-pointer`}
      onClick={onClick}
      disabled={disable}
      name={name}
      value={value}
    >
      {itemCount !== undefined && itemCount !== null && (
        <div className="absolute top-0 z-20 compact:right-0 mobile:right-0 mobile-lg:right-2 fold:right-5 tablet:right-2 -translate-y-1/2 compact:size-5 mobile-lg:size-7 shrink-0 rounded-full bg-green-400 flex items-center justify-center">
          <span className="font-rokh text-black leading-none translate-y-1 compact:text-base fold:text-lg laptop:text-xl">
            {itemCount}
          </span>
        </div>
      )}

      <div
        className={`${title ? "w-full" : "w-auto"} flex ${
          iconFirst ? "flex-row-reverse" : "flex-row"
        } ${
          itemsGap === 0 || itemsGap === undefined
            ? title
              ? "justify-between"
              : "justify-center"
            : "justify-center"
        } items-center`}
        style={{ gap: itemsGap }}
      >
        {title && (
          <div
            className={`mt-1 ${!icon ? "grow" : "grow-0"} whitespace-nowrap`}
          >
            {title}
          </div>
        )}

        {icon && (
          <span className={`${iconClasses ?? ""} self-center`}>{icon}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
