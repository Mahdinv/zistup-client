import z from "zod";

export const ConventionalGlobalDietSchema = z.object({
  id: z.number(),
  price: z.number().optional(),
  health: z.number().optional(),
  environment: z.number().optional(),
  loyal: z.number().optional(),
});

export type ConventionalGlobalDiet = z.infer<
  typeof ConventionalGlobalDietSchema
>;
