import { memo, type ReactNode, useCallback, useMemo, useState } from "react";

import { useKeenSlider, type KeenSliderPlugin } from "keen-slider/react";
import { motion } from "framer-motion";

import "keen-slider/keen-slider.min.css";

type SliderItem = {
  name: string;
  icon: ReactNode;
  title: string;
  description: string;
};

type DietSliderProps = {
  items: SliderItem[];
  autoplayDelay?: number;
};

const createAutoplayPlugin = (delay: number): KeenSliderPlugin => {
  return (slider) => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let isHovered = false;

    const clearTimer = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    };

    const startTimer = () => {
      clearTimer();

      if (isHovered) return;

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
      slider.container.addEventListener("mouseenter", handleMouseEnter);

      slider.container.addEventListener("mouseleave", handleMouseLeave);

      startTimer();
    });

    slider.on("dragStarted", clearTimer);
    slider.on("animationEnded", startTimer);
    slider.on("updated", startTimer);

    slider.on("destroyed", () => {
      clearTimer();

      slider.container.removeEventListener("mouseenter", handleMouseEnter);

      slider.container.removeEventListener("mouseleave", handleMouseLeave);
    });
  };
};

const DietSlider = ({ items, autoplayDelay = 3500 }: DietSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const autoplayPlugin = useMemo(
    () => createAutoplayPlugin(autoplayDelay),
    [autoplayDelay],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      mode: "free-snap",

      slides: {
        origin: "center",
        perView: 1.4,
        spacing: 16,
      },

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
    [autoplayPlugin],
  );

  const handleDotClick = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index);
    },
    [instanceRef],
  );

  if (!items.length) return null;

  return (
    <section className="w-full overflow-hidden">
      <div ref={sliderRef} dir="ltr" className="keen-slider">
        {items.map((item) => (
          <div key={item.name} className="keen-slider__slide">
            <SliderCard item={item} />
          </div>
        ))}
      </div>

      <div dir="ltr" className="mt-4 flex items-center justify-center gap-1">
        {items.map((item, index) => {
          const isActive = currentSlide === index;
          return (
            <motion.button
              layout
              key={item.name}
              type="button"
              aria-label={`اسلاید ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => handleDotClick(index)}
              initial={false}
              animate={{
                width: isActive ? 28 : 8,
              }}
              transition={{
                width: {
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                },
                layout: {
                  duration: 0.32,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="
                        h-2 shrink-0
                        rounded-full
                        bg-blue-800
                    "
            />
          );
        })}
      </div>
    </section>
  );
};

const SliderCard = memo(({ item }: { item: SliderItem }) => {
  return (
    <article
      dir="rtl"
      className="
          flex h-40 w-full
          flex-col items-start gap-4
          rounded-2xl
          bg-darker-blue-300
          p-4
          text-center
        "
    >
      <div
        className={`
            flex compact:size-10 fold:size-11 laptop:size-12
            shrink-0
            items-center justify-center
            rounded-full
            ${item.name === "environment-slider-item" ? "bg-[#AAFFC9]" : item.name === "health-slider-item" ? "bg-[#FFB7BC]" : item.name === "price-slider-item" ? "bg-[#FCECAD]" : "bg-[#C8E0FF]"}
            compact:text-[27px] fold:text-[29px] laptop:text-[31px]
            text-black
          `}
      >
        {item.icon}
      </div>

      <div className="w-full space-y-1">
        <h3
          className={`
              font-yekan
              compact:text-xl fold:text-2xl laptop:text-3xl
              font-extrabold
              leading-[120%]
              ${item.name === "environment-slider-item" ? "text-[#AAFFC9]" : item.name === "health-slider-item" ? "text-[#FFB7BC]" : item.name === "price-slider-item" ? "text-[#FCECAD]" : "text-[#C8E0FF]"}
              text-start
            `}
        >
          {item.title}
        </h3>

        <p
          className="
              mt-2
              font-peyda
              compact:text-sm fold:text-base laptop:text-lg
              font-medium
              text-justify
              leading-[140%]
              text-blue-700
            "
        >
          {item.description}
        </p>
      </div>
    </article>
  );
});

SliderCard.displayName = "SliderCard";

export default DietSlider;
