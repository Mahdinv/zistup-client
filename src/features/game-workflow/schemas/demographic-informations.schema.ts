import z from "zod";

export const demographicInformationFormSchema = z.object({
  sportDayPerWeek: z
    .number({
      error: "تعداد روزهای ورزش در هفته الزامی است",
    })
    .int("تعداد روزهای ورزش باید عدد صحیح باشد")
    .min(0, "تعداد روزها نمی‌تواند کمتر از صفر باشد")
    .max(7, "تعداد روزهای ورزش نمی‌تواند بیشتر از ۷ باشد"),
  province: z.string().optional(),
  city: z.string().optional(),
  dietIncomePercent: z
    .number()
    .int()
    .min(0, "مقدار نمی‌تواند کمتر از صفر باشد")
    .max(100, "مقدار نمی‌تواند بیشتر از 100 باشد")
    .optional(),
});

export type DemographicInformationForm = z.infer<
  typeof demographicInformationFormSchema
>;
