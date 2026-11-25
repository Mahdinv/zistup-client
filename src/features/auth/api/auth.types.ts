export type AuthIdentifierDTO =
  | {
      mobile: string;
      email?: never;
    }
  | {
      email: string;
      mobile?: never;
    };

export type VerifyOtpDTO = AuthIdentifierDTO & {
  code: string;
  refCode?: string;
};

export type UsernameRegistrationVerifyDTO = {
  mobile: string;
  code: string;
  username: string;
  password: string;
  name?: string;
  version: "1.0";
  versionCode: 101;
};

export type UsernameAvailability = {
  username: string;
  message: string;
} & (
  | { available: true; reason: null }
  | { available: false; reason: "taken" | "invalid" }
);
