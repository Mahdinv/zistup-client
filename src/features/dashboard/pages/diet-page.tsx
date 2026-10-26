import CurrentDiet from "../components/diets/current-diet";
import TargetDiet from "../components/diets/target-diet";
import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import DietGoals from "../components/diets/diet-goals";

const tabs = [
  { key: "goals", title: "اهداف رژیم" },
  { key: "target", title: "رژیم هدف" },
] as const;

const DietPage = () => {
  const [activeTab, setActiveTab] = useState<"goals" | "target">("goals");
  const shouldReduceMotion = useReducedMotion();
  const tabsId = useId();
  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <CurrentDiet />
      <div
        role="tablist"
        aria-label="رژیم‌ها"
        dir="rtl"
        className="flex w-full items-center rounded-2xl border border-gray-100 bg-blue-200 p-1.5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] dark:border-dark dark:bg-darker-blue-200"
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
          tabButtons[index]?.focus();
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
            className={`flex-1 cursor-pointer rounded-[10px] px-2 py-1.5 font-peyda text-sm font-bold fold:text-lg laptop:text-xl focus-visible:outline-2 focus-visible:outline-blue-600 ${activeTab === tab.key ? "bg-green-500 text-darker-green-200" : "text-darker-green-200 dark:text-white"}`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {/* Overlapping grid cells reserve both panels' height during tab changes. */}
      <div className="grid w-full">
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
            className={`col-start-1 row-start-1 w-full min-w-0 self-start ${activeTab === tab.key ? "" : "pointer-events-none"}`}
          >
            {tab.key === "goals" ? (
              <DietGoals />
            ) : (
              <div className="flex w-full flex-col items-center gap-4">
                <TargetDiet />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DietPage;
