import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { PiMagnifyingGlass } from "react-icons/pi";

type SearchBoxProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "value" | "onChange" | "type" | "className" | "size"
> & {
  value: string;
  onChange: (value: string) => void;
  loading?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
};

export default function SearchBox({
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
    <div className="flex flex-row-reverse gap-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-blue-500 bg-blue-200 px-3 text-blue-900 focus-within:border-blue-900 dark:border-blue-900 dark:bg-darker-blue-400 dark:text-white dark:focus-within:border-blue-400">
        {icon}
        <input
          {...inputProps}
          type="search"
          value={value}
          disabled={disabled}
          aria-busy={loading || undefined}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 min-w-0 w-full bg-transparent text-base outline-none placeholder:text-blue-600 dark:placeholder:text-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {action}
    </div>
  );
}
