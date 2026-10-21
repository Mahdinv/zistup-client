import { useId, useState } from "react";
import { PiMagnifyingGlass, PiMicrophone, PiX } from "react-icons/pi";
import { toast } from "sonner";
import SearchBox from "@/shared/base-components/search-box";
import useDebouncedValue from "@/shared/hooks/use-debounced-value.hook";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import useExerciseSearchQuery from "../../../hooks/use-exercise-search-query.hook";
import type { Exercise } from "../../../api/types/exercise.types";
import {
  readRecentExercises,
  rememberExercise,
  writeRecentExercises,
} from "../../../lib/physical-activity.utils";

type Props = {
  open: boolean;
  value: Exercise | null;
  onChange: (exercise: Exercise | null) => void;
  error?: string;
};

export default function ExerciseSearch({
  open,
  value,
  onChange,
  error,
}: Props) {
  const id = useId();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState(readRecentExercises);
  const term = text.trim();
  const debounced = useDebouncedValue(term);
  const waiting = term !== debounced;
  const query = useExerciseSearchQuery(
    debounced,
    open && focused && !value && !waiting,
  );
  const showRecent = !term;
  const items = showRecent ? recent : waiting ? [] : (query.data?.items ?? []);
  const expanded =
    open && focused && !value && (Boolean(term) || recent.length > 0);
  const loading = !showRecent && (waiting || query.isPending);
  const select = (exercise: Exercise) => {
    onChange(exercise);
    setText(exercise.label);
    setFocused(false);
    setActiveIndex(-1);
    const next = rememberExercise(recent, exercise);
    setRecent(next);
    writeRecentExercises(next);
  };

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <SearchBox
        appearance="physical-activity"
        value={text}
        onChange={(next) => {
          setText(next);
          onChange(null);
          setFocused(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setFocused(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            setFocused(false);
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setFocused(true);
            setActiveIndex((index) =>
              items.length
                ? (index +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    items.length) %
                  items.length
                : -1,
            );
          }
          if (event.key === "Enter" && expanded) {
            event.preventDefault();
            if (items[activeIndex]) select(items[activeIndex]);
          }
        }}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? id : undefined}
        aria-activedescendant={
          expanded && items[activeIndex]
            ? `${id}-${items[activeIndex].id}`
            : undefined
        }
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-label="جستجوی فعالیت"
        placeholder="جستجوی فعالیت (مثلاً دویدن، بدنسازی...)"
        loading={expanded && loading}
        icon={
          <PiMagnifyingGlass
            aria-hidden
            className="size-6 shrink-0 text-blue-500 dark:text-blue-900 group-focus-within:text-orange-300 dark:group-focus-within:text-orange-300"
          />
        }
        action={
          <button
            type="button"
            aria-label="جستجوی صوتی (به‌زودی)"
            onClick={() => toast.info("جستجوی صوتی هنوز فعال نیست")}
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-500 bg-blue-300 text-blue-500 dark:border-darker-blue-100 dark:bg-darker-blue-400 dark:text-blue-900"
          >
            <PiMicrophone aria-hidden className="size-6" />
          </button>
        }
      />
      {expanded && (
        <div className="absolute left-0 top-14 z-30 max-h-52 w-[calc(100%-52px)] overflow-y-auto rounded-2xl border border-blue-500 bg-blue-300 shadow-[0_4px_12px_0_#00000040] dark:border-dark dark:bg-darker-blue-400 dark:shadow-[0_4px_12px_0_#00000080]">
          {showRecent && (
            <p className="px-2.5 pt-2 pb-1 text-sm text-blue-900">
              جستوجو های اخیر:
            </p>
          )}
          {loading ? (
            <p role="status" className="p-3 text-base">
              در حال جستجو...
            </p>
          ) : !showRecent && query.isError ? (
            <div role="alert" className="p-3 text-base">
              <p>{getApiErrorMessage(query.error)}</p>
              <button
                type="button"
                className="mt-2 text-orange-300"
                onClick={() => void query.refetch()}
              >
                تلاش مجدد
              </button>
            </div>
          ) : (
            <>
              <ul
                id={id}
                role="listbox"
                aria-label={
                  showRecent ? "فعالیت‌های اخیر" : "نتایج جستجوی فعالیت"
                }
              >
                {items.map((item, index) => (
                  <li
                    key={item.id}
                    className={`flex min-h-10.5 items-center hover:bg-blue-200 dark:hover:bg-darker-blue-200 ${index === activeIndex ? "bg-blue-200 dark:bg-darker-blue-200" : ""}`}
                  >
                    <button
                      type="button"
                      role="option"
                      id={`${id}-${item.id}`}
                      aria-selected={index === activeIndex}
                      className="min-w-0 flex-1 px-2.5 py-2.5 text-right text-base focus-visible:outline-2 focus-visible:outline-orange-200"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => select(item)}
                    >
                      {item.label}
                    </button>
                    {showRecent && (
                      <button
                        type="button"
                        aria-label={`حذف ${item.label} از فعالیت‌های اخیر`}
                        className="p-2.5 text-blue-900"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          const next = recent.filter(
                            (entry) => entry.id !== item.id,
                          );
                          setRecent(next);
                          writeRecentExercises(next);
                        }}
                      >
                        <PiX aria-hidden className="size-5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {!items.length && (
                <p role="status" className="p-3 text-base">
                  فعالیتی پیدا نشد.
                </p>
              )}
            </>
          )}
        </div>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-red-400 dark:text-red-200"
        >
          {error}
        </p>
      )}
    </div>
  );
}
