import z, { string } from "zod";

const socialAlignmentFieldsSchema = z.object({
  foodGroupId: z.number(),
  title: string().optional(),
  imageUrl: string().optional(),
  priority: z.number(),
  newPriority: z.number(),
  x: z.number(),
});

export const socialAlignmentFormSchema = z.object({
  items: z.array(socialAlignmentFieldsSchema),
});

export type SocialAlignmentForm = z.infer<typeof socialAlignmentFormSchema>;
