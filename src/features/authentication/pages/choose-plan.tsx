import { useOutletContext } from "react-router-dom";
import type { AuthOutletContext } from "../../../layouts/auth-layout";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MainContainer from "../components/main-container";
import ChoosePlanForm from "../components/choose-plan-form";
import ConventionalGlobalDiets from "../components/conventional-global-diets";
import ConventionalGlobalDietDetails from "../components/conventional-global-diet-details";

const ChoosePlan = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (step === 2) {
      setBackHandler(() => {
        setStep(1);
      });
    }

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  return (
    <MainContainer isFirstStep={step === 1} isLastStep={step === 3}>
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <ChoosePlanForm key="step-1" />
        ) : step === 2 ? (
          <ConventionalGlobalDiets key="step-2" />
        ) : (
          <ConventionalGlobalDietDetails key="step-3" />
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default ChoosePlan;
