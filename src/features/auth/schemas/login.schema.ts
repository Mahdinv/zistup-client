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

export const PasswordSchema = z
  .string()
  .min(1, "رمز عبور را وارد کنید")
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر داشته باشد")
  .regex(/\p{Lu}[\s\S]*\p{Lu}/u, "رمز عبور باید حداقل ۲ حرف بزرگ داشته باشد")
  .regex(/\p{Nd}[\s\S]*\p{Nd}/u, "رمز عبور باید حداقل ۲ رقم داشته باشد")
  .regex(
    /[\p{P}\p{S}][\s\S]*[\p{P}\p{S}]/u,
    "رمز عبور باید حداقل ۲ کاراکتر ویژه (مثل !@#) داشته باشد",
  );

export const UsernameLoginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: PasswordSchema,
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
