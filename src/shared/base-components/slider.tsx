import { type ReactNode, useCallback, useMemo, useState } from "react";

import {
  useKeenSlider,
  type KeenSliderOptions,
  type KeenSliderPlugin,
} from "keen-slider/react";

import "keen-slider/keen-slider.min.css";

type AutoplayOptions = {
  delay?: number;
  pauseOnHover?: boolean;
};

type SliderProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  loop?: boolean;
  showDots?: boolean;
  autoplay?: false | AutoplayOptions;
  slides?: KeenSliderOptions["slides"];
  slideClassName?: string;
};

const createAutoplayPlugin = ({
  delay = 3500,
  pauseOnHover = true,
}: AutoplayOptions): KeenSliderPlugin => {
  return (slider) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let isHovered = false;

    const clearTimer = () => {
      if (!timeout) return;

      clearTimeout(timeout);
      timeout = undefined;
    };

    const startTimer = () => {
      clearTimer();

      if (pauseOnHover && isHovered) return;

      timeout = setTimeout(() => {
        slider.next();
      }, delay);
    };

    const handleMouseEnter = () => {
      isHovered = true;
      clearTimer();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      startTimer();
    };

    slider.on("created", () => {
      if (pauseOnHover) {
        slider.container.addEventListener("mouseenter", handleMouseEnter);
        slider.container.addEventListener("mouseleave", handleMouseLeave);
      }

      startTimer();
    });

    slider.on("dragStarted", clearTimer);
    slider.on("animationEnded", startTimer);
    slider.on("updated", startTimer);
    slider.on("destroyed", () => {
      clearTimer();
      if (pauseOnHover) {
        slider.container.removeEventListener("mouseenter", handleMouseEnter);
        slider.container.removeEventListener("mouseleave", handleMouseLeave);
      }
    });
  };
};

const Slider = <T,>({
  items,
  getKey,
  renderItem,
  loop = false,
  showDots = false,
  autoplay = false,
  slides = {
    origin: "center",
    perView: 1.4,
    spacing: 8,
  },
  slideClassName = "",
}: SliderProps<T>) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const plugins = useMemo<KeenSliderPlugin[]>(() => {
    if (!autoplay) return [];

    return [createAutoplayPlugin(autoplay)];
  }, [autoplay]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop,
      rtl: true,
      mode: "free-snap",
      slides,
      defaultAnimation: {
        duration: 650,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      },
      created(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    plugins,
  );

  const handleDotClick = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index);
    },
    [instanceRef],
  );

  if (!items.length) return null;

  return (
    <section className="w-full min-w-0 overflow-hidden">
      <div ref={sliderRef} dir="rtl" className="keen-slider">
        {items.map((item) => (
          <div
            key={getKey(item)}
            className={`keen-slider__slide ${slideClassName}`}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>

      {showDots && items.length > 1 && (
        <div dir="rtl" className="mt-4 flex items-center justify-center gap-1">
          {items.map((item, index) => {
            const isActive = currentSlide === index;

            return (
              <button
                key={getKey(item)}
                type="button"
                aria-label={`اسلاید ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => handleDotClick(index)}
                className={`
                  h-1 shrink-0
                  rounded-full
                  bg-blue-800
                  transition-[width] duration-300 ease-out
                  ${isActive ? "w-4" : "w-1"}
                `}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Slider;
