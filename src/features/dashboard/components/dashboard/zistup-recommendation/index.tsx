import {
  memo,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import RecommendationAccordion, {
  type Recommendation,
} from "./recommendation-accordion";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { RecommendationSkeleton } from "../dashboard-skeleton";

import type { NutritionAdvice } from "../../../api/types/nutrition.types";

const emptyAdvices: NutritionAdvice[] = [];

const VISIBLE_ITEM_COUNT = 10;

type ZistupRecommendationProps = {
  advices?: readonly NutritionAdvice[];
  isLoading?: boolean;
};

const ZistupRecommendation = ({
  advices = emptyAdvices,
  isLoading = false,
}: ZistupRecommendationProps) => {
  const recommendations = useMemo<Recommendation[]>(
    () =>
      advices.map(({ name, advice }, index) => ({
        id: name + "-" + index,
        title: name,
        description: advice,
      })),
    [advices],
  );
  const [activeId, setActiveId] = useState<Recommendation["id"] | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const shouldScroll = recommendations.length > VISIBLE_ITEM_COUNT;
  const onToggle = useCallback((id: Recommendation["id"]) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  useLayoutEffect(() => {
    const list = listRef.current;
    const viewport = viewportRef.current;
    if (!shouldScroll || !list || !viewport) return;

    const triggers = Array.from(
      list.querySelectorAll<HTMLButtonElement>("[data-recommendation-trigger]"),
    ).slice(0, VISIBLE_ITEM_COUNT);
    const updateHeight = () => {
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      // Expanded content never changes the cap; measure headers and row chrome only.
      const height = triggers.reduce(
        (total, trigger) => {
          const row = trigger.parentElement!;
          const style = getComputedStyle(row);
          return (
            total +
            trigger.getBoundingClientRect().height +
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom) +
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth)
          );
        },
        gap * (triggers.length - 1),
      );
      viewport.style.height = `${height}px`;
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    triggers.forEach((trigger) => observer.observe(trigger));
    return () => observer.disconnect();
  }, [recommendations, shouldScroll]);

  const list = (
    <ul ref={listRef} className="w-full flex flex-col items-center gap-1.5">
      {recommendations.map((recommendation) => (
        <RecommendationAccordion
          key={recommendation.id}
          item={recommendation}
          open={activeId === recommendation.id}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
  return (
    <div
      aria-busy={isLoading}
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-start gap-4
                "
    >
      <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
        توصیه‌های زیستاپ
      </h2>
      {isLoading ? (
        <RecommendationSkeleton />
      ) : recommendations.length === 0 ? (
        <p className="w-full text-center font-peyda compact:text-sm fold:text-base laptop:text-lg text-blue-900 dark:text-blue-300">
          هنوز توصیه‌ای برای این روز ثبت نشده است
        </p>
      ) : shouldScroll ? (
        <div
          ref={viewportRef}
          className="w-full min-h-0 [--scroll-fade-color:var(--color-blue-100)] dark:[--scroll-fade-color:var(--color-darker-blue-400)]"
        >
          <ScrollFade className="[overflow-anchor:none]">{list}</ScrollFade>
        </div>
      ) : (
        list
      )}
    </div>
  );
};

export default memo(ZistupRecommendation);
