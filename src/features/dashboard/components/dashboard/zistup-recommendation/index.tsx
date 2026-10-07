import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import RecommendationAccordion, {
  type Recommendation,
} from "./recommendation-accordion";
import ScrollFade from "@/shared/base-components/scroll-fade";

const defaultRecommendations: Recommendation[] = [
  {
    id: 1,
    title: "کمبود آهن",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 2,
    title: "کمبود منیزیم",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 3,
    title: "کمبود کلسیم",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 4,
    title: "کمبود فیبر",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 5,
    title: "کمبود ویتامین دی",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 6,
    title: "کمبود کلسیم",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 7,
    title: "کمبود فیبر",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 8,
    title: "کمبود ویتامین دی",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 9,
    title: "کمبود کلسیم",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 10,
    title: "کمبود فیبر",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
  {
    id: 11,
    title: "کمبود ویتامین دی",
    description:
      "مصرف سبزی‌خوردن تازه، کاهو و گشنیز به افزایش جذب آهن و بهبود سلامت گوارش کمک می‌کند. همچنین تأمین از کشت بومی، باعث کاهش هزینه‌های حمل‌ونقل و حفظ محیط‌زیست می‌شود.",
  },
];

const VISIBLE_ITEM_COUNT = 10;

type ZistupRecommendationProps = {
  recommendations?: readonly Recommendation[];
};

const ZistupRecommendation = ({
  recommendations = defaultRecommendations,
}: ZistupRecommendationProps) => {
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
      {shouldScroll ? (
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
