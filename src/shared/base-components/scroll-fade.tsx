import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollFadeProps = {
  children: ReactNode;
  className?: string;
  showBottomFade?: boolean;
};

const ScrollFade = ({
  children,
  className = "",
  showBottomFade = true,
}: ScrollFadeProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [hasContentAbove, setHasContentAbove] = useState(false);
  const [hasContentBelow, setHasContentBelow] = useState(false);

  const updateFadeVisibility = useCallback(() => {
    const element = scrollRef.current;

    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    const maxScrollTop = scrollHeight - clientHeight;

    setHasContentAbove(scrollTop > 2);

    setHasContentBelow(maxScrollTop > 2 && scrollTop < maxScrollTop - 2);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;

    if (!element) return;

    updateFadeVisibility();

    const resizeObserver = new ResizeObserver(() => {
      updateFadeVisibility();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateFadeVisibility]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={updateFadeVisibility}
        className={`
          h-full
          overflow-y-auto
          scrollbar-none
          [&::-webkit-scrollbar]:hidden
          ${className}
        `}
      >
        {children}
      </div>

      {/* گرادیان ظریف بالا */}
      <div
        aria-hidden="true"
        className={`
          pointer-events-none
          absolute
          top-0
          left-1/2
          z-20
          h-3
          w-screen
          -translate-x-1/2
          bg-linear-to-b
          from-darker-blue-200
          via-darker-blue-200/35
          to-transparent
          transition-opacity
          duration-150
          ease-out
          ${hasContentAbove ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* گرادیان ظریف پایین */}
      {showBottomFade && (
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            bottom-0
            left-1/2
            z-20
            h-2.5
            w-screen
            -translate-x-1/2
            bg-linear-to-t
            from-darker-blue-200
            via-darker-blue-200/30
            to-transparent
            transition-opacity
            duration-150
            ease-out
            ${hasContentBelow ? "opacity-100" : "opacity-0"}
          `}
        />
      )}
    </div>
  );
};

export default ScrollFade;
