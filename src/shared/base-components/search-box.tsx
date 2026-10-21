import { cn } from "@/shared/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

type SearchBoxProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "type" | "className" | "size"
> & {
  appearance?: "default" | "quick-add-meal";
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function SearchBox({
  appearance = "default",
  value,
  onChange,
  loading = false,
  disabled,
  icon = (
    <PiMagnifyingGlass aria-hidden className="size-6 shrink-0 text-blue-800" />
  ),
  action,
  ...inputProps
}: SearchBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-row-reverse gap-1.5",
        appearance === "quick-add-meal" && "gap-1",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-blue-500 bg-blue-200 px-3 text-blue-900 focus-within:border-blue-900 dark:border-blue-900 dark:bg-darker-blue-400 dark:text-white dark:focus-within:border-blue-400",
          appearance === "quick-add-meal" &&
            "bg-blue-300 px-4 dark:border-darker-blue-100",
          appearance === "quick-add-meal" &&
            value &&
            "border-blue-900 dark:border-blue-400",
        )}
      >
        {icon}
        <input
          {...inputProps}
          type="search"
          value={value}
          disabled={disabled}
          aria-busy={loading || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            "h-12 min-w-0 w-full bg-transparent text-base outline-none placeholder:text-blue-600 dark:placeholder:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50",
            appearance === "quick-add-meal" &&
              "h-[46px] placeholder:text-sm placeholder:text-blue-500",
          )}
        />
      </div>
      {action}
    </div>
  );
}
