import type { To } from "react-router-dom";

export type PlaygroundFlowHeaderConfig = {
  title?: string;
  subTitle?: string;
  backTo?: To;
};

export type PlaygroundFlowHeaderOverride = {
  title?: string;
  subTitle?: string;
  onBack?: () => void;
};

export type PlaygroundFlowRouteHandle = {
  header?: PlaygroundFlowHeaderConfig;
};

export type PlaygroundFlowStepHeader = {
  title?: string;
  subTitle?: string;
};

export type PlaygroundFlowLayoutContext = {
  setHeaderOverride: (config: PlaygroundFlowHeaderOverride) => void;
};
