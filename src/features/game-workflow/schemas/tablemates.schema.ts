import z from "zod";

export const tablematesFieldsSchema = z.object({
  name: z.string().nonempty("لطفا نام همسفره را وارد کنید"),
  sharedMealsCount: z
    .number()
    .min(1, "لطفا تعداد وعده‌های مشترک را مشخص کنید")
    .refine((val) => val !== undefined, {
      message: "لطفا تعداد وعده‌های مشترک را مشخص کنید",
    }),
  relationshipLevel: z.string().nonempty("لطفا سطح ارتباط را انتخاب کنید"),
  influenceLevel: z.string().nonempty("لطفا میزان تاثیر رژیم را انتخاب کنید"),
});

export const tablematesFormSchema = z.object({
  tablemates: z.array(tablematesFieldsSchema),
});

export type TablematesForm = z.infer<typeof tablematesFormSchema>;
