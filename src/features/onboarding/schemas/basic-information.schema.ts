import z from "zod";

export const BasicInformationSchema = z.object({
  name: z.string().nonempty("مقدار این فیلد اجباری است"),
  sex: z.custom<"male" | "female" | undefined>(
    (value) => value === "male" || value === "female",
    {
      error: "لطفا جنسیت خود را انتخاب کنید",
    },
  ),
  weight: z.number().min(1, "لطفا وزن خود را انتخاب کنید"),
  height: z.number(),
  birthDate: z.string().nonempty("لطفا تاریخ تولد خود را انتخاب کنید"),
  mainGoal: z.string().nonempty("لطفا هدف اصلی خود را انتخاب کنید"),
  focus: z.array(z.string()).min(1, "لطفا هدف اصلی خود را انتخاب کنید"),
});

export type BasicInformation = z.infer<typeof BasicInformationSchema>;
