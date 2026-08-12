import z from "zod";

const iranMobileRegex = /^09\d{9}$/;

export const LoginSchema = z.object({
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

export type Login = z.infer<typeof LoginSchema>;
export type Otp = z.infer<typeof OtpSchema>;
