import z, { number } from "zod";

export const pastWeekIntakeFieldsSchema = z.object({
  foodGroupId: number().int("لطفا عدد صحیح وارد کنید"),
  categoryId: number().int("لطفا عدد صحیح وارد کنید"),
  value: number().int("لطفا عدد صحیح وارد کنید"),
  percentUsage: number(),
});

export const pastWeekIntakeFormSchema = z.object({
  items: z.array(pastWeekIntakeFieldsSchema),
});

export type PastWeekIntakeForm = z.infer<typeof pastWeekIntakeFormSchema>;
