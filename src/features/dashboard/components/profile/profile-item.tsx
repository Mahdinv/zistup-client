import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { PiCaretLeft } from "react-icons/pi";
import { cn } from "@/shared/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  icon: IconType;
  onClick?: () => void;
  children?: ReactNode;
  destructive?: boolean;
};
export default function ProfileItem({
  title,
  subtitle,
  icon: Icon,
  onClick,
  children,
  destructive,
}: Props) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-[42px] shrink-0 items-center justify-center rounded-[9px] bg-blue-500 dark:bg-darker-blue-200 text-blue-900 dark:text-blue-800",
          destructive && "text-red-400 dark:text-red-300",
        )}
      >
        <Icon size={32} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-right">
        <span className="text-base font-bold leading-[1.4]">{title}</span>
        {subtitle && (
          <span className="text-sm font-medium leading-[1.4] text-blue-900 dark:text-blue-700">
            {subtitle}
          </span>
        )}
      </span>
      {children ??
        (!destructive && (
          <PiCaretLeft
            size={24}
            className="shrink-0 text-blue-900 dark:text-blue-400"
            aria-hidden="true"
          />
        ))}
    </>
  );
  const className =
    "flex min-h-[66px] w-full items-center gap-3 rounded-[20px] border border-transparent bg-[#A5DAEE] p-[11px] text-darker-green-200 shadow-[0_4px_4px_rgba(0,0,0,0.04)] dark:border-dark dark:bg-darker-blue-300 dark:text-white";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        className,
        "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 dark:focus-visible:outline-blue-400 motion-safe:active:scale-[0.99]",
      )}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
