import z from "zod";

export const RegistrationUsernameSchema = z
  .string()
  .trim()
  .min(1, "نام کاربری را وارد کنید")
  .max(50, "نام کاربری باید حداکثر ۵۰ کاراکتر باشد")
  .regex(
    /^[A-Za-z][A-Za-z0-9]*$/,
    "نام کاربری فقط حروف و اعداد انگلیسی است و باید با حرف شروع شود",
  );

export const PasswordSchema = z
  .string()
  .min(1, "رمز عبور را وارد کنید")
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر داشته باشد")
  .regex(
    /[A-Z][\s\S]*[A-Z]/,
    "رمز عبور باید حداقل ۲ حرف بزرگ انگلیسی داشته باشد",
  )
  .regex(/\p{Nd}[\s\S]*\p{Nd}/u, "رمز عبور باید حداقل ۲ رقم داشته باشد")
  .regex(
    /[\p{P}\p{S}][\s\S]*[\p{P}\p{S}]/u,
    "رمز عبور باید حداقل ۲ کاراکتر ویژه (مثل !@#) داشته باشد",
  );

export const PasswordConfirmationSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "رمز عبور و تکرار آن یکسان نیستند",
  });

export const UsernameRegisterSchema = PasswordConfirmationSchema.safeExtend({
  mobile: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید"),
  username: RegistrationUsernameSchema,
});

export type ResetPassword = z.infer<typeof PasswordConfirmationSchema>;

export type UsernameRegister = z.infer<typeof UsernameRegisterSchema>;
