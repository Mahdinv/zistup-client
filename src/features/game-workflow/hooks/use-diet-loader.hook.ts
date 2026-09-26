import { useEffect, useMemo, useState } from "react";
import type { LoaderStepType } from "../api/optimized-dietary.types";

type UseDietLoaderProps = {
  steps: LoaderStepType[];
  durations: number[];
  isRequestDone: boolean;
};

const useDietLoader = ({
  steps,
  durations,
  isRequestDone,
}: UseDietLoaderProps) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const lastStepIndex = steps.length - 1;

  useEffect(() => {
    if (activeStepIndex >= lastStepIndex) return;

    const timeoutId = window.setTimeout(() => {
      setActiveStepIndex((prev) => prev + 1);
    }, durations[activeStepIndex]);

    return () => window.clearTimeout(timeoutId);
  }, [activeStepIndex, durations, lastStepIndex]);

  const isLoaderCompleted = activeStepIndex === lastStepIndex && isRequestDone;

  const loaderSteps = useMemo<LoaderStepType[]>(() => {
    return steps.map((step, index) => {
      if (index < activeStepIndex) {
        return {
          ...step,
          status: "completed",
        };
      }

      if (index === activeStepIndex) {
        return {
          ...step,
          status: isLoaderCompleted ? "completed" : "in-progress",
        };
      }

      return {
        ...step,
        status: "pending",
      };
    });
  }, [steps, activeStepIndex, isLoaderCompleted]);

  return {
    loaderSteps,
    activeStepIndex,
    isLoaderCompleted,
  };
};

export default useDietLoader;
