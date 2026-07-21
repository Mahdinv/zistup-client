import z from "zod";

export const DemographicInformationSchema = z.object({
  name: z.string().nonempty("مقدار این فیلد اجباری است"),
  sex: z.custom<1 | 2>((value) => value === 1 || value === 2, {
    error: "لطفا جنسیت خود را انتخاب کنید",
  }),
  weight: z.number().min(1, "لطفا وزن خود را انتخاب کنید"),
  height: z.number(),
  age: z.number().min(1, "لطفا سن خود را انتخاب کنید"),
  mainGoal: z.string().nonempty("لطفا هدف اصلی خود را انتخاب کنید"),
  focus: z.array(z.string()).min(1, "لطفا هدف اصلی خود را انتخاب کنید"),
});

export type DemographicInformation = z.infer<
  typeof DemographicInformationSchema
>;
