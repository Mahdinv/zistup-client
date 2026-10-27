import { cn } from "../lib/utils";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type ScrollFadeProps = {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  showBottomFade?: boolean;
  viewportRef?: RefObject<HTMLDivElement | null>;
};

const ScrollFade = ({
  children,
  className = "",
  wrapperClassName,
  showBottomFade = true,
  viewportRef,
}: ScrollFadeProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const edgesRef = useRef({ above: false, below: false });
  useImperativeHandle(viewportRef, () => scrollRef.current!, []);

  const [hasContentAbove, setHasContentAbove] = useState(false);
  const [hasContentBelow, setHasContentBelow] = useState(false);

  const updateFadeVisibility = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const maxScrollTop = scrollHeight - clientHeight;

    const above = scrollTop > 2;
    const below = maxScrollTop > 2 && scrollTop < maxScrollTop - 2;
    // Scrolling within the same edges should not schedule React updates.
    if (above !== edgesRef.current.above) setHasContentAbove(above);
    if (below !== edgesRef.current.below) setHasContentBelow(below);
    edgesRef.current = { above, below };
  }, []);

  const scheduleFadeUpdate = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      updateFadeVisibility();
    });
  }, [updateFadeVisibility]);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    updateFadeVisibility();

    const resizeObserver = new ResizeObserver(scheduleFadeUpdate);
    element.addEventListener("scroll", scheduleFadeUpdate, { passive: true });

    const observeContent = () => {
      resizeObserver.disconnect();
      resizeObserver.observe(element);
      // Content can resize while the scroll viewport stays fixed (e.g. accordions).
      Array.from(element.children).forEach((child) =>
        resizeObserver.observe(child),
      );
      scheduleFadeUpdate();
    };
    observeContent();
    const mutationObserver = new MutationObserver(observeContent);
    mutationObserver.observe(element, { childList: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      element.removeEventListener("scroll", scheduleFadeUpdate);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [updateFadeVisibility, scheduleFadeUpdate]);

  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden",
        wrapperClassName,
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          `
                    h-full
                    min-w-0
                    overflow-x-hidden
                    overflow-y-auto
                    scrollbar-none
                    [&::-webkit-scrollbar]:hidden
                  `,
          className,
        )}
      >
        {children}
      </div>

      <div
        aria-hidden="true"
        className={`
        pointer-events-none absolute inset-x-0 top-0 z-20 h-3
        bg-linear-to-b
        from-[var(--scroll-fade-color,var(--color-darker-blue-200))]
        via-[var(--scroll-fade-color,var(--color-darker-blue-200))]/35
        to-transparent
        transition-opacity duration-150 ease-out motion-reduce:transition-none
        ${hasContentAbove ? "opacity-100" : "opacity-0"}
      `}
      />

      {showBottomFade && (
        <div
          aria-hidden="true"
          className={`
          pointer-events-none absolute inset-x-0 bottom-0 z-20 h-2.5
          bg-linear-to-t
          from-[var(--scroll-fade-color,var(--color-darker-blue-200))]
          via-[var(--scroll-fade-color,var(--color-darker-blue-200))]/30
          to-transparent
          transition-opacity duration-150 ease-out motion-reduce:transition-none
          ${hasContentBelow ? "opacity-100" : "opacity-0"}
        `}
        />
      )}
    </div>
  );
};

export default ScrollFade;
