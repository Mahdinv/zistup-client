import type { PlaygroundFlowRouteHandle } from "./playground-flow-types";

export function hasPlaygroundFlowHeaderSetting(
  value: unknown,
): value is PlaygroundFlowRouteHandle {
  return typeof value === "object" && value !== null && "header" in value;
}
