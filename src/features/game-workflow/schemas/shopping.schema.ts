import z from "zod";

export const shoppingFieldsSchema = z.object({
  foodGroupId: z.number(),
  imageUrl: z.string(),
  title: z.string(),
  value: z.number().min(0.5, "مقدار نمی‌تواند 0 باشد"),
  positionPrice: z.number().optional(),
  positionHealth: z.number().optional(),
  positionEnvironment: z.number().optional(),
  positionAvailable: z.number().optional(),
  importancePrice: z.number().optional(),
  importanceHealth: z.number().optional(),
  importanceEnvironment: z.number().optional(),
  importanceAvailable: z.number().optional(),
});

export const shoppingFormSchema = z.object({
  items: z.array(shoppingFieldsSchema),
});

export type ShoppingForm = z.infer<typeof shoppingFormSchema>;
