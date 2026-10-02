import { Suspense, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type DashboardFlowContainerProps = {
  children: ReactNode;
  pageKey: string;
};

const pageOrder = ["dashboard", "diet", "zistyar", "profile"];

const getPageIndex = (pageKey: string) =>
  pageOrder.indexOf(pageKey.split("/")[2]);

type PageTransition = {
  direction: number;
  reducedMotion: boolean;
};

const pageVariants = {
  enter: ({ direction, reducedMotion }: PageTransition) => ({
    opacity: reducedMotion ? 1 : 0,
    x: reducedMotion ? "0%" : `${-direction * 100}%`,
  }),
  center: { opacity: 1, x: "0%" },
  exit: ({ direction, reducedMotion }: PageTransition) => ({
    opacity: reducedMotion ? 1 : 0,
    x: reducedMotion ? "0%" : `${direction * 100}%`,
    transition: { duration: reducedMotion ? 0 : 0.2 },
  }),
};

const DashboardFlowContainer = ({
  children,
  pageKey,
}: DashboardFlowContainerProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [navigation, setNavigation] = useState({ pageKey, direction: 0 });

  if (navigation.pageKey !== pageKey) {
    const previousIndex = getPageIndex(navigation.pageKey);
    const nextIndex = getPageIndex(pageKey);

    setNavigation({
      pageKey,
      direction:
        previousIndex === -1 || nextIndex === -1
          ? 0
          : Math.sign(nextIndex - previousIndex),
    });
  }

  const pageTransition: PageTransition = {
    direction: navigation.direction,
    reducedMotion: Boolean(shouldReduceMotion),
  };

  return (
    <AnimatePresence mode="wait" custom={pageTransition}>
      <motion.main
        key={pageKey}
        custom={pageTransition}
        variants={pageVariants}
        initial={shouldReduceMotion ? false : "enter"}
        animate="center"
        exit="exit"
        transition={{
          duration: shouldReduceMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-full min-h-0 w-full min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain compact:px-4 fold:px-6 pt-3 pb-(--dashboard-bottom-space) scroll-pb-(--dashboard-bottom-space)"
      >
        <Suspense
          fallback={
            <p role="status" className="py-3 text-center">
              در حال بارگذاری...
            </p>
          }
        >
          {children}
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

export default DashboardFlowContainer;
