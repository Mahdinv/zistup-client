import z, { number } from "zod";

const preferredFoodFieldsSchema = z.object({
  foodGroupId: number().int().optional(),
  priority: number().int().optional(),
});

export const preferredFoodFormSchema = z.object({
  items: z.array(preferredFoodFieldsSchema),
});

export type PreferredFoodForm = z.infer<typeof preferredFoodFormSchema>;
