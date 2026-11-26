export type AuthIdentifierDTO =
  | {
      mobile: string;
      email?: never;
    }
  | {
      email: string;
      mobile?: never;
    };

export type PasswordLoginDTO = { username: string; password: string };
export type ForgotPasswordDTO = { username: string };
export type ForgotPasswordResult = { mobile: string; message: string };
export type VerifyForgotPasswordDTO = ForgotPasswordDTO & { code: string };
export type VerifyForgotPasswordResult = {
  reset_token: string;
  expires_in: number;
};
export type ResetForgotPasswordDTO = { reset_token: string; password: string };
export type ResetForgotPasswordResult = { message: string };
export type PasswordResetGrant = { token: string; expiresAt: number };
export type PasswordLoginResult = {
  id: number;
  name: string;
  mobile: string;
  username: string;
  token: string;
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
