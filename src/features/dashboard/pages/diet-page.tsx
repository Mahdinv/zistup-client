import CurrentDiet from "../components/diets/current-diet";
import TargetDiet from "../components/diets/target-diet";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import DietGoals from "../components/diets/diet-goals";
import ScrollFade from "@/shared/base-components/scroll-fade";
import useOptimizedDietaryQuery from "@/features/game-workflow/hooks/use-optimized-dietary-query.hook";
import { useQuery } from "@tanstack/react-query";
import { getDiets } from "@/features/onboarding/api/diet.api";

const tabs = [
  { key: "goals", title: "اهداف رژیم" },
  { key: "target", title: "رژیم هدف" },
] as const;

const DietPage = () => {
  const planQuery = useOptimizedDietaryQuery(true);
  const activeDiet = planQuery.data?.success
    ? planQuery.data.data.diet
    : undefined;
  const dietsQuery = useQuery({
    queryKey: ["diets"],
    queryFn: getDiets,
    staleTime: 60 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
  const activeDietTitle =
    planQuery.data?.success
      ? planQuery.data.data.dietGoalsSummary?.diet.title
      : undefined;
  const [activeTab, setActiveTab] = useState<"goals" | "target">("goals");
  const shouldReduceMotion = useReducedMotion();
  const tabsId = useId();
  const viewportRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousTab = useRef(activeTab);

  useLayoutEffect(() => {
    if (previousTab.current === activeTab) return;
    previousTab.current = activeTab;
    const viewport = viewportRef.current;
    const tabList = tabListRef.current;
    const content = contentRef.current;
    if (!viewport || !tabList || !content) return;

    const gap =
      parseFloat(getComputedStyle(content.parentElement!).rowGap) || 0;
    const top =
      viewport.scrollTop +
      content.getBoundingClientRect().top -
      viewport.getBoundingClientRect().top -
      tabList.offsetHeight -
      gap;
    viewport.scrollTo({
      top: Math.max(0, top),
      behavior: shouldReduceMotion ? "instant" : "smooth",
    });
  }, [activeTab, shouldReduceMotion]);
  return (
    <ScrollFade
      viewportRef={viewportRef}
      wrapperClassName="[--scroll-fade-color:var(--color-blue-300)] dark:[--scroll-fade-color:var(--color-darker-blue-500)]"
      className="overscroll-contain scroll-smooth motion-reduce:scroll-auto"
    >
      <div className="flex min-h-full w-full flex-col items-center gap-4 pt-3 pb-(--dashboard-bottom-space)">
        <div className="w-full shrink-0">
          <CurrentDiet diet={activeDiet} title={activeDietTitle} />
        </div>
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="رژیم‌ها"
          dir="rtl"
          className="sticky top-0 z-30 flex w-full shrink-0 items-center rounded-2xl border border-gray-100 bg-blue-200 p-1.5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] dark:border-dark dark:bg-darker-blue-200"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const index =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 1
                  : activeTab === "goals"
                    ? 1
                    : 0;
            setActiveTab(tabs[index].key);
            const tabButtons =
              event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
            tabButtons[index]?.focus({ preventScroll: true });
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${tabsId}-${tab.key}-tab`}
              aria-controls={`${tabsId}-${tab.key}-panel`}
              aria-selected={activeTab === tab.key}
              tabIndex={activeTab === tab.key ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 cursor-pointer rounded-xs px-2 py-1.5 font-peyda text-sm font-bold fold:text-lg laptop:text-xl focus-visible:outline-2 focus-visible:outline-blue-600 ${activeTab === tab.key ? "bg-green-500 text-darker-green-200" : "text-darker-green-200 dark:text-white"}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
        {/* Only the active panel contributes height; clip the retained inactive panel. */}
        <div ref={contentRef} className="relative grid w-full overflow-hidden">
          {tabs.map((tab) => (
            <motion.div
              key={tab.key}
              role="tabpanel"
              id={`${tabsId}-${tab.key}-panel`}
              aria-labelledby={`${tabsId}-${tab.key}-tab`}
              aria-hidden={activeTab !== tab.key}
              inert={activeTab !== tab.key}
              initial={false}
              animate={{
                opacity: activeTab === tab.key ? 1 : 0,
                y: shouldReduceMotion || activeTab === tab.key ? 0 : 6,
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`col-start-1 row-start-1 w-full min-w-0 self-start ${activeTab === tab.key ? "relative" : "pointer-events-none absolute inset-0 h-full overflow-hidden"}`}
            >
              {tab.key === "goals" ? (
                <DietGoals />
              ) : (
                <div className="flex w-full flex-col items-center gap-4">
                  <TargetDiet
                    activeDietKey={activeDiet?.key}
                    diets={dietsQuery.data}
                    isLoading={dietsQuery.isPending}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollFade>
  );
};

export default DietPage;
