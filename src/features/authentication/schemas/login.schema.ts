import z from "zod";

export const LoginSchema = z.object({
  mobile: z
    .string()
    .nonempty("این فیلد اجباری است")
    .refine(
      (value) => {
        const isEmail = z.email().safeParse(value).success;
        const isPhone = /^09\d{9}$/.test(value);

        return isEmail || isPhone;
      },
      { message: "ورودی نامعتبر" },
    ),
  invitationCode: z.string().optional(),
});

export type Login = z.infer<typeof LoginSchema>;
