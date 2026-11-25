import z from "zod";

const iranMobileRegex = /^09\d{9}$/;

export const PhoneLoginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "این فیلد اجباری است")
    .refine(
      (value) => {
        const isEmail = z.email().safeParse(value).success;
        const isMobile = iranMobileRegex.test(value);

        return isEmail || isMobile;
      },
      {
        message: "شماره موبایل یا ایمیل معتبر وارد کنید",
      },
    ),

  invitationCode: z.string().trim().optional(),
});

export const UsernameLoginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export const OtpSchema = z.object({
  identifier: z.union([
    z.object({
      mobile: z.string(),
    }),
    z.object({
      email: z.string(),
    }),
  ]),
  refCode: z.string().optional(),
  code: z
    .string()
    .min(1, "لطفاً کد امنیتی را وارد کنید")
    .length(4, "کد امنیتی را کامل وارد کنید"),
});

export type PhoneLogin = z.infer<typeof PhoneLoginSchema>;
export type UsernameLogin = z.infer<typeof UsernameLoginSchema>;
export type Otp = z.infer<typeof OtpSchema>;
