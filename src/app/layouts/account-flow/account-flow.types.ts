export type AccountFlowHeaderConfig = {
  firstLineTitle: string;
  secondLineTitle?: string;
  subTitle?: string;
  imageName?: string;
  backTo?: string;
};

export type AccountFlowRouteHandle = {
  // object: Display the Header
  // false: Not Display the Header
  // undefined: Use the settings of parent route or default value
  accountFlowHeader?: AccountFlowHeaderConfig | false;
  step?: number;
};

export type AccountFlowNavigationState<T = unknown> = {
  data?: T;
  accountFlowHeader?: AccountFlowHeaderConfig;
};

export type AccountFlowOutletContext = {
  setBackHandler: (handler: (() => void) | null) => void;
};
