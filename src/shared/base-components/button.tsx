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
  type,
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
        <div className="absolute top-0 compact:left-0 mobile:left-3 mobile-lg:left-5 fold:left-10 tablet:left-3 laptop:left-3 -translate-y-1/2 compact:size-6 mobile-lg:size-8 shrink-0 rounded-full bg-green-400 flex items-center justify-center">
          <span className="font-rokh text-black leading-none translate-y-1 compact:text-lg fold:text-xl laptop:text-2xl">
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
          <div className={`mt-1 ${!icon ? "grow" : "grow-0"}`}>{title}</div>
        )}

        {icon && (
          <span className={`${iconClasses ?? ""} self-center`}>{icon}</span>
        )}
      </div>
    </button>
  );
};

export default Button;
