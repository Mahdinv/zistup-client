import type {
  AccountFlowHeaderConfig,
  AccountFlowRouteHandle,
} from "./account-flow.types";

export const DEFAULT_ACCOUNT_FLOW_HEADER: AccountFlowHeaderConfig = {
  firstLineTitle: "زیست‌آپ",
};

export function hasAccountFlowHeaderSetting(
  value: unknown,
): value is AccountFlowRouteHandle {
  return (
    typeof value === "object" && value !== null && "accountFlowHeader" in value
  );
}

export function hasStepSetting(
  value: unknown,
): value is AccountFlowRouteHandle {
  return (
    typeof value === "object" &&
    value !== null &&
    "step" in value &&
    typeof value.step === "number"
  );
}
