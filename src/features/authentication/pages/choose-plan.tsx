import { useMatches, useOutlet } from "react-router-dom";

import MainContainer from "../components/main-container";
import { hasStepSetting } from "../types/auth-route-handle";

const ChoosePlan = () => {
  const matches = useMatches();
  const outlet = useOutlet();

  const currentStepHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasStepSetting);

  const step = currentStepHandle?.step ?? 1;

  return (
    <MainContainer
      stepKey={step}
      isFirstStep={step === 1}
      isLastStep={step === 3}
      scrollMode="child"
    >
      {outlet}
    </MainContainer>
  );
};

export default ChoosePlan;
