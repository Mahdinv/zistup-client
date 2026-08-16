import type {
  PlaygroundFlowLayoutContext,
  PlaygroundFlowStepHeader,
} from "@/app/layouts/playground-flow/playground-flow-types";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

type UsePlaygroundFlowHeaderParams = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  headerStepsData?: PlaygroundFlowStepHeader[];
};

const usePlaygroundFlowHeader = ({
  step,
  setStep,
  headerStepsData = [],
}: UsePlaygroundFlowHeaderParams) => {
  const { setHeaderOverride } = useOutletContext<PlaygroundFlowLayoutContext>();

  useEffect(() => {
    if (step === 1) {
      setHeaderOverride({});
      return;
    }

    const currentHeader = headerStepsData[step - 2];

    setHeaderOverride({
      ...currentHeader,
      onBack: () => {
        setStep((prev) => prev - 1);
      },
    });
  }, [step, setStep, headerStepsData, setHeaderOverride]);
};

export default usePlaygroundFlowHeader;
