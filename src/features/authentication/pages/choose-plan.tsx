import { useLocation, useMatches, useOutlet } from "react-router-dom";

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
    <MainContainer
      stepKey={location.pathname}
      isFirstStep={step === 1}
      isLastStep={step === 3}
      scrollMode="container"
    >
      {outlet}
    </MainContainer>
  );
};

export default ChoosePlan;
