export type PlaygroundFlowOrigin =
  | "/app/diets"
  | "/onboarding/choose-plan";

export function getPlaygroundFlowOrigin(state: unknown): PlaygroundFlowOrigin | undefined {
  if (!state || typeof state !== "object" || !("origin" in state)) return undefined;
  return state.origin === "/app/diets" || state.origin === "/onboarding/choose-plan"
    ? state.origin
    : undefined;
}
