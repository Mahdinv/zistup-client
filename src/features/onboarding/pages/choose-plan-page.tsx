import AccountFlowContainer from "@/app/layouts/account-flow/account-flow-container";
import { hasStepSetting } from "@/app/layouts/account-flow/account-flow-route";
import { useMatches, useOutlet } from "react-router-dom";

const ChoosePlan = () => {
  const matches = useMatches();
  const outlet = useOutlet();

  const currentStepHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasStepSetting);

  const step = currentStepHandle?.step ?? 1;

  return (
    <AccountFlowContainer
      stepKey={step}
      isFirstStep={step === 1}
      isLastStep={step === 3}
      scrollMode="child"
    >
      {outlet}
    </AccountFlowContainer>
  );
};

export default ChoosePlan;
