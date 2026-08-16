import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactElement,
  type RefAttributes,
} from "react";
import { createPortal } from "react-dom";
import { HiOutlineChevronDown } from "react-icons/hi";

export type ComboBoxValue = string | number;

export type ComboBoxOption<T extends ComboBoxValue> = {
  value: T;
  label: string;
};

export type ComboBoxProps<T extends ComboBoxValue> = {
  value?: T | null;
  onChange: (value: T) => void;
  onBlur?: () => void;
  options: ComboBoxOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  name?: string;
};

type ComboBoxContentProps<T extends ComboBoxValue> = ComboBoxProps<T> & {
  forwardedRef: ForwardedRef<HTMLButtonElement>;
};

type DropdownPlacement = "top" | "bottom";

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
  placement: DropdownPlacement;
};

const ITEM_HEIGHT = 36;
const MAX_VISIBLE_ITEMS = 6;
const MENU_VERTICAL_PADDING = 8;
const DROPDOWN_GAP = 10;
const VIEWPORT_PADDING = 8;

const getDropdownHeight = (optionsCount: number) => {
  const visibleItems = Math.min(optionsCount, MAX_VISIBLE_ITEMS);

  return visibleItems * ITEM_HEIGHT + MENU_VERTICAL_PADDING * 2;
};

const CHEVRON_BASE_STYLE: CSSProperties = {
  transformOrigin: "center",
  transition: "transform 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  willChange: "transform",
  backfaceVisibility: "hidden",
};

const setForwardedRef = <T,>(ref: ForwardedRef<T>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
};

const ComboBoxContent = <T extends ComboBoxValue>({
  value,
  onChange,
  onBlur,
  options,
  placeholder = "انتخاب کنید",
  disabled = false,
  error = false,
  className = "",
  name,
  forwardedRef,
}: ComboBoxContentProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value);

  const updateDropdownPosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const desiredDropdownHeight = getDropdownHeight(options.length);

    const spaceBelow =
      viewportHeight - rect.bottom - DROPDOWN_GAP - VIEWPORT_PADDING;

    const spaceAbove = rect.top - DROPDOWN_GAP - VIEWPORT_PADDING;

    const canOpenBelow = spaceBelow >= desiredDropdownHeight;

    const canOpenAbove = spaceAbove >= desiredDropdownHeight;

    let placement: DropdownPlacement;

    if (canOpenBelow) {
      placement = "bottom";
    } else if (canOpenAbove) {
      placement = "top";
    } else {
      placement = spaceBelow >= spaceAbove ? "bottom" : "top";
    }

    const availableHeight = placement === "bottom" ? spaceBelow : spaceAbove;

    const height = Math.max(
      0,
      Math.min(desiredDropdownHeight, availableHeight),
    );

    const maxAvailableWidth = Math.max(0, viewportWidth - VIEWPORT_PADDING * 2);

    const width = Math.min(rect.width, maxAvailableWidth);

    const maxLeft = viewportWidth - width - VIEWPORT_PADDING;

    const left = Math.min(
      Math.max(rect.left, VIEWPORT_PADDING),
      Math.max(VIEWPORT_PADDING, maxLeft),
    );

    const top =
      placement === "bottom"
        ? rect.bottom + DROPDOWN_GAP
        : Math.max(VIEWPORT_PADDING, rect.top - DROPDOWN_GAP - height);

    const nextPosition: DropdownPosition = {
      top,
      left,
      width,
      height,
      placement,
    };

    setDropdownPosition((previousPosition) => {
      if (
        previousPosition?.top === nextPosition.top &&
        previousPosition.left === nextPosition.left &&
        previousPosition.width === nextPosition.width &&
        previousPosition.height === nextPosition.height &&
        previousPosition.placement === nextPosition.placement
      ) {
        return previousPosition;
      }

      return nextPosition;
    });
  }, [options.length]);

  const openDropdown = useCallback(() => {
    if (disabled || options.length === 0) {
      return;
    }

    const selectedIndex = options.findIndex((option) => option.value === value);

    updateDropdownPosition();

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    setIsOpen(true);
  }, [disabled, options, updateDropdownPosition, value]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    onBlur?.();
  }, [onBlur]);

  const toggleDropdown = useCallback(() => {
    if (disabled || options.length === 0) {
      return;
    }

    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  }, [closeDropdown, disabled, isOpen, openDropdown, options.length]);

  const selectOption = useCallback(
    (option: ComboBoxOption<T>) => {
      if (disabled) return;

      onChange(option.value);

      setIsOpen(false);
      setActiveIndex(-1);

      onBlur?.();

      triggerRef.current?.focus();
    },
    [disabled, onBlur, onChange],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || options.length === 0) {
      return;
    }

    if (!isOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        openDropdown();
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      closeDropdown();

      triggerRef.current?.focus();

      return;
    }

    if (event.key === "Tab") {
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex >= options.length - 1 ? 0 : currentIndex + 1,
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((currentIndex) =>
        currentIndex <= 0 ? options.length - 1 : currentIndex - 1,
      );

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      const activeOption = options[activeIndex];

      if (activeOption) {
        selectOption(activeOption);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const clickedInsideTrigger = containerRef.current?.contains(target);

      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (clickedInsideTrigger || clickedInsideDropdown) {
        return;
      }

      closeDropdown();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [closeDropdown, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    let animationFrameId = 0;

    const schedulePositionUpdate = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        updateDropdownPosition();
      });
    };

    const handleScroll = (event: Event) => {
      const target = event.target;

      if (target instanceof Node && dropdownRef.current?.contains(target)) {
        return;
      }

      schedulePositionUpdate();
    };

    window.addEventListener("resize", schedulePositionUpdate);

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener("resize", schedulePositionUpdate);

      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) {
      return;
    }

    optionRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex, isOpen]);

  const handleTriggerRef = (element: HTMLButtonElement | null) => {
    triggerRef.current = element;

    setForwardedRef(forwardedRef, element);
  };

  return (
    <>
      <div
        ref={containerRef}
        dir="rtl"
        className={`relative w-full ${className}`}
      >
        <button
          ref={handleTriggerRef}
          type="button"
          name={name}
          disabled={disabled}
          aria-disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && activeIndex >= 0
              ? `${listboxId}-option-${activeIndex}`
              : undefined
          }
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          className={`
            flex w-full items-center justify-between
            rounded-2xl border-2 px-3 py-2
            bg-darker-blue-400
            text-xl font-medium
            outline-none
            transition-[border-color,opacity] duration-200
            ${
              error
                ? "border-red-500"
                : disabled
                  ? "border-[#34343d]"
                  : isOpen
                    ? "border-green-400"
                    : "border-green-950"
            }
            
            ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          `}
        >
          <span
            className={`
              ${
                disabled
                  ? "text-[#77777f]"
                  : selectedOption
                    ? "text-white"
                    : isOpen
                      ? "text-green-400"
                      : "text-green-950"
              }
                    font-peyda text-sm font-medium
            `}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <span
            style={{
              ...CHEVRON_BASE_STYLE,
              transform: isOpen
                ? "translateZ(0) rotate(180deg)"
                : "translateZ(0) rotate(0deg)",
            }}
            className="flex items-center justify-center"
          >
            <HiOutlineChevronDown
              className={`text-4xl ${disabled ? "text-[#34343d]" : isOpen ? "text-green-400" : "text-green-950"}`}
            />
          </span>
        </button>
      </div>

      {isOpen &&
        !disabled &&
        dropdownPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            dir="rtl"
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              height: dropdownPosition.height,
            }}
            className="
              z-9999
              overflow-hidden
              rounded-[22px]
              border border-[#292833]
              bg-darker-blue-300
              shadow-[0_16px_40px_rgba(0,0,0,0.22)]
            "
          >
            <div
              id={listboxId}
              role="listbox"
              className="
                h-full
                overflow-y-auto
                py-2
                scrollbar-thin
                overscroll-contain
                [scrollbar-color:#34333e_transparent]
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-[#34333e]
              "
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;

                const isActive = index === activeIndex;

                return (
                  <button
                    id={`${listboxId}-option-${index}`}
                    key={String(option.value)}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                    className={`
                        flex w-full shrink-0
                        items-center justify-start
                        p-2.5
                        text-right text-xs
                        transition-colors duration-150
                        ${isSelected ? "text-green-400" : "text-[#f4f4f5]"}
                        ${isActive ? "bg-white/4.5" : "bg-transparent"}
                        whitespace-nowrap
                      `}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

type ComboBoxComponent = <T extends ComboBoxValue>(
  props: ComboBoxProps<T> & RefAttributes<HTMLButtonElement>,
) => ReactElement;

const ComboBox = forwardRef(
  <T extends ComboBoxValue>(
    props: ComboBoxProps<T>,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <ComboBoxContent
        key={props.disabled ? "disabled" : "enabled"}
        {...props}
        forwardedRef={ref}
      />
    );
  },
) as ComboBoxComponent;

export default ComboBox;
