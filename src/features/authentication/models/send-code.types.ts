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
