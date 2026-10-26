import {
  Suspense,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useIsPresent,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import DashboardFlowHeader from "./dashboard-flow-header";

const PROFILE_PATH = "/app/profile";
const pageOrder = ["dashboard", "diets", "zistyar"];
const getPageIndex = (key: string) => pageOrder.indexOf(key.split("/")[2]);
const tabTransition: Transition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };
const tabVariants = {
  enter: (direction: number) => ({ x: `${-direction * 100}%` }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: `${direction * 100}%` }),
};

function RouteContent({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <p role="status" className="py-3 text-center">
          در حال بارگذاری...
        </p>
      }
    >
      {children}
    </Suspense>
  );
}

function ProfileScene({ children }: { children: ReactNode }) {
  const isPresent = useIsPresent();
  // The viewport never translates: only the shared header elements and menu move.
  // A transparent scene lets the returning Header remain visible during projection.
  return (
    <motion.main
      data-dashboard-scene="profile"
      aria-hidden={!isPresent}
      inert={!isPresent}
      className="absolute inset-0 z-10 overflow-hidden compact:px-4 fold:px-6"
    >
      <RouteContent>{children}</RouteContent>
    </motion.main>
  );
}

const DashboardFlowContainer = ({
  children,
  pageKey,
}: {
  children: ReactNode;
  pageKey: string;
}) => {
  const reducedMotion = useReducedMotion();
  const layoutGroupId = useId();
  const headerSlot = useRef<HTMLDivElement>(null);
  const isProfile = pageKey === PROFILE_PATH;
  const [navigation, setNavigation] = useState({
    pageKey,
    leavingProfile: false,
  });
  if (navigation.pageKey !== pageKey) {
    setNavigation({
      pageKey,
      leavingProfile:
        !isProfile &&
        (navigation.pageKey === PROFILE_PATH || navigation.leavingProfile),
    });
  }
  // Retain the dashboard outlet and its scroll/state while Profile is open.
  const [background, setBackground] = useState(() => ({
    pageKey: isProfile ? null : pageKey,
    outlet: isProfile ? null : children,
    direction: 0,
  }));
  if (!isProfile && background.pageKey !== pageKey) {
    const previous = background.pageKey ? getPageIndex(background.pageKey) : -1;
    const next = getPageIndex(pageKey);
    setBackground({
      pageKey,
      outlet: children,
      direction:
        navigation.pageKey === PROFILE_PATH ||
        navigation.leavingProfile ||
        previous < 0 ||
        next < 0
          ? 0
          : Math.sign(next - previous),
    });
  }
  // Hold the original header slot while its shared elements project into Profile.
  // The retained dashboard must not resize or clamp its scroll position.
  useLayoutEffect(() => {
    if (isProfile) return;
    const slot = headerSlot.current;
    const header = slot?.querySelector("header");
    if (!slot || !header) return;
    const measure = () => {
      slot.style.height = `${header.offsetHeight}px`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, [isProfile]);
  const direction = reducedMotion ? 0 : background.direction;
  return (
    <LayoutGroup id={layoutGroupId}>
      <section
        data-dashboard-scene="dashboard"
        aria-hidden={isProfile}
        inert={isProfile}
        className="absolute inset-0 flex min-h-0 flex-col"
      >
        <div
          ref={headerSlot}
          className={`relative shrink-0 ${isProfile ? "z-0" : "z-20"}`}
        >
          <AnimatePresence initial={false} mode="sync">
            {!isProfile && <DashboardFlowHeader key="dashboard-header" />}
          </AnimatePresence>
        </div>
        <div
          className="relative min-h-0 flex-1 overflow-hidden"
          style={{
            visibility:
              isProfile || navigation.leavingProfile ? "hidden" : "visible",
          }}
        >
          <AnimatePresence initial={false} mode="sync" custom={direction}>
            {background.pageKey && (
              <motion.main
                key={background.pageKey}
                custom={direction}
                variants={tabVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={reducedMotion ? { duration: 0 } : tabTransition}
                className={`absolute inset-0 overflow-x-hidden ${background.pageKey === "/app/diets" ? "overflow-y-hidden" : background.pageKey === "/app/zistyar" ? "overflow-y-hidden pb-(--dashboard-bottom-space)" : "overflow-y-auto pt-3 pb-(--dashboard-bottom-space) scroll-pb-(--dashboard-bottom-space)"} overscroll-contain compact:px-4 fold:px-6`}
              >
                <RouteContent>
                  {isProfile ? background.outlet : children}
                </RouteContent>
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      </section>
      <AnimatePresence
        initial={false}
        mode="sync"
        onExitComplete={() =>
          setNavigation((current) =>
            current.leavingProfile
              ? { ...current, leavingProfile: false }
              : current,
          )
        }
      >
        {isProfile && <ProfileScene key="profile">{children}</ProfileScene>}
      </AnimatePresence>
    </LayoutGroup>
  );
};
export default DashboardFlowContainer;
