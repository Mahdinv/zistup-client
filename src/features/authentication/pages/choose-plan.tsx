import { useLocation, useMatches, useOutlet } from "react-router-dom";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import MainContainer from "../components/main-container";
import { hasStepSetting } from "../types/auth-route-handle";

const ChoosePlan = () => {
  const matches = useMatches();
  const location = useLocation();
  const outlet = useOutlet();
  const currentStepHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasStepSetting);

  const step = currentStepHandle?.step ?? 1;

  return (
    <MainContainer isFirstStep={step === 1} isLastStep={step === 3}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="flex
                            min-h-full
                            w-full
                            min-w-0
                            max-w-full
                            flex-1
                            flex-col
                            justify-start
                            items-start
                            gap-2
                            overflow-x-clip
                            compact:px-4
                            mobile-lg:px-6
                            py-7
                            will-change-[transform,opacity]"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </MainContainer>
  );
};

export default ChoosePlan;
