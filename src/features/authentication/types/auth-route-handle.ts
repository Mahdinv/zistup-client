export type AuthHeaderConfig = {
  firstLineTitle: string;
  secondLineTitle?: string;
  subTitle?: string;
  imageName?: string;
  backTo?: string;
};

export type AuthRouteHandle = {
  // object: Display the Header
  // false: Not Display the Header
  // undefined: Use the settings of parent route or default value
  authHeader?: AuthHeaderConfig | false;
  step?: number;
};

export const DEFAULT_AUTH_HEADER: AuthHeaderConfig = {
  firstLineTitle: "زیست‌آپ",
};

export function hasAuthHeaderSetting(value: unknown): value is AuthRouteHandle {
  return typeof value === "object" && value !== null && "authHeader" in value;
}

export function hasStepSetting(value: unknown): value is AuthRouteHandle {
  return (
    typeof value === "object" &&
    value !== null &&
    "step" in value &&
    typeof value.step === "number"
  );
}
