import { memo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineChevronUp } from "react-icons/hi";
import { PiWarningBold } from "react-icons/pi";

export type Recommendation = {
  id: string | number;
  title: string;
  description: string;
};

type RecommendationAccordionProps = {
  item: Recommendation;
  open: boolean;
  onToggle: (id: Recommendation["id"]) => void;
};

const RecommendationAccordion = ({
  item,
  open,
  onToggle,
}: RecommendationAccordionProps) => {
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const transition = {
    duration: shouldReduceMotion ? 0 : 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <li
      className="w-full
                    bg-blue-300 dark:bg-darker-blue-200
                    border border-blue-500 dark:border-darker-blue-100
                    rounded-xxs px-4.5 py-2.5
                    flex flex-col items-center"
    >
      <button
        type="button"
        data-recommendation-trigger
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(item.id)}
        className="w-full flex flex-row justify-between items-center cursor-pointer text-start"
      >
        <span className="flex-1 dark:text-yellow-300 flex flex-row justify-start items-center gap-1">
          <PiWarningBold className="compact:text-4xl fold:text-5xl laptop:text-[28px]" />
          <span className="font-peyda font-bold compact:text-sm fold:text-base laptop:text-lg">
            {item.title}
          </span>
        </span>
        <motion.span
          initial={false}
          animate={{ rotate: open ? 0 : 180 }}
          transition={transition}
          className="flex shrink-0"
        >
          <HiOutlineChevronUp
            className="dark:text-blue-900 compact:text-3xl fold:text-4xl laptop:text-5xl cursor-pointer"
            strokeWidth={1.5}
          />
        </motion.span>
      </button>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={transition}
        aria-hidden={!open}
        inert={!open}
        className="w-full overflow-hidden"
      >
        <div className="pt-2">
          <div className="w-full border-t border-blue-500 dark:border-dark">
            <p className="pt-2 text-justify">{item.description}</p>
          </div>
        </div>
      </motion.div>
    </li>
  );
};

export default memo(RecommendationAccordion);
