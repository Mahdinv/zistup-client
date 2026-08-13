import {
  PiCalendarCheck,
  PiCaretDownBold,
  PiHeart,
  PiSteps,
} from "react-icons/pi";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import Range from "@/shared/base-components/range";
import { useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import type { ConventionalGlobalDiet } from "../schemas/conventional-global-diet.schema";
import { useMutation } from "@tanstack/react-query";
import { normalizeApiError } from "../../../shared/api";
import { toast } from "sonner";
import { addConventionalGlobalDiet } from "../api/diet.api";
import type { AccountFlowNavigationState } from "@/app/layouts/account-flow/account-flow.types";
import type { Diet } from "../api/diet.types";

const priorityOptions = [
  { title: "1", value: 1 },
  { title: "2", value: 2 },
  { title: "3", value: 3 },
  { title: "4", value: 4 },
  { title: "5", value: 5 },
];

const ConventionalGlobalDietDetails = () => {
  const location = useLocation();
  const [priorityBox, setPriorityBox] = useState<boolean>(true);

  const { control, handleSubmit } = useForm<ConventionalGlobalDiet>();

  const { mutate, isPending } = useMutation({
    mutationFn: addConventionalGlobalDiet,
    onSuccess: () => {
      toast.success("رژیم شما انتخاب شد");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const routeState = location.state as AccountFlowNavigationState<Diet> | null;
  const diet = routeState?.data;

  if (!diet) {
    return (
      <Navigate
        to="/onboarding/choose-plan/conventional-global-diets"
        replace
      />
    );
  }

  const handleConventionalGlobalDietSubmit: SubmitHandler<
    ConventionalGlobalDiet
  > = (data) => {
    const finalData = {
      ...data,
      id: diet.id,
    };
    mutate(finalData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleConventionalGlobalDietSubmit)}
      className="w-full min-h-0 h-full flex flex-col items-center gap-4"
    >
      <ScrollFade>
        <div className="w-full flex-1 min-h-full flex flex-col justify-start items-center gap-6 overflow-y-auto scrollbar-gutter-stable">
          <ul className="w-full flex flex-row justify-center items-center gap-2">
            <li className="w-full bg-darker-blue-100 rounded-lg px-3 py-3.5 font-peyda flex flex-col justify-center items-center gap-1">
              <PiCalendarCheck className="text-7xl text-blue-300" />
              <small className="text-blue-600 text-xs font-medium">
                مدت نتیجه
              </small>
              <label className="text-lg font-medium">
                <span className="font-rokh text-base ml-0.5">
                  {diet.duration}
                </span>
                هفته
              </label>
            </li>
            <li className="w-full bg-darker-blue-100 rounded-lg px-3 py-3.5 font-peyda flex flex-col justify-center items-center gap-1">
              <PiSteps className="text-7xl text-blue-300" />
              <small className="text-blue-600 text-xs font-medium">سختی</small>
              <label className="text-lg font-medium">{diet.level}</label>
            </li>
            <li className="w-full bg-darker-blue-100 rounded-lg px-3 py-3.5 font-peyda flex flex-col justify-center items-center gap-1">
              <PiHeart className="text-7xl text-blue-300" />
              <small className="text-blue-600 text-xs font-medium">تمرکز</small>
              <label className="text-lg font-medium">{diet.focus}</label>
            </li>
          </ul>
          <p className="w-full font-peyda text-base font-medium">{diet.desc}</p>
          <div className="w-full flex flex-col items-start gap-4">
            <h3 className="text-green-600 font-yekan text-base font-extrabold">
              این رژیم مناسب شماست، اگر...
            </h3>
            <ul className="w-full flex flex-row flex-wrap justify-start gap-2">
              {(diet.positiveTag || []).map((positive) => (
                <li className="w-auto bg-green-950 text-green-300 font-peyda text-sm font-bold rounded-full px-4 py-1.5">
                  {positive}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex flex-col items-start gap-4">
            <h3 className="text-red-300 font-yekan text-base font-extrabold">
              این رژیم مناسب نیست، اگر...
            </h3>
            <ul className="w-full flex flex-row flex-wrap justify-start gap-2">
              {(diet.negativeTeg || []).map((negative) => (
                <li className="w-auto bg-[#7B1717] text-red-75 font-peyda text-sm font-bold rounded-full px-4 py-1.5">
                  {negative}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full flex-1 flex flex-col justify-end items-center gap-2">
            <div
              className="w-full text-blue-400 flex flex-row justify-center items-center gap-2"
              onClick={() => setPriorityBox((prev: boolean) => !prev)}
            >
              <h3 className="font-peyda text-base font-medium">
                اولویت‌های خودت رو مشخص کن
              </h3>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: priorityBox ? 180 : 0 }}
                transition={{ duration: 0.5, ease: easeInOut }}
              >
                <PiCaretDownBold className="text-4xl" />
              </motion.div>
            </div>
            <AnimatePresence initial={false}>
              {priorityBox && (
                <motion.div
                  key="priority-box"
                  initial={{
                    height: 0,
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    y: -10,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: easeInOut,
                  }}
                  className="w-full overflow-hidden"
                >
                  <div className="w-full bg-darker-blue-300 border border-dark rounded-2xl p-3 flex flex-col justify-center items-start gap-3">
                    <h3 className="font-yekan text-base font-extrabold">
                      چه چیزی برایت مهم‌تر است؟
                    </h3>

                    <ul className="w-full flex flex-col justify-start items-start gap-2.5">
                      {(diet.questions || []).map((question) => {
                        const [name, title] = Object.entries(question)[0] as [
                          "price" | "health" | "environment" | "loyal",
                          string,
                        ];
                        return (
                          <li
                            key={name}
                            className="w-full flex flex-row justify-between items-center"
                          >
                            <h4 className="flex-2/5 font-peyda text-sm font-bold">
                              {title}
                            </h4>
                            <div className="w-full flex-3/5">
                              <Controller
                                name={name}
                                control={control}
                                defaultValue={3}
                                render={({ field }) => (
                                  <Range
                                    options={priorityOptions}
                                    initialValue={2}
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                )}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ScrollFade>
      <Button
        classes="w-full! btn btn-primary-blue"
        title="شروع رژیم"
        disable={isPending}
      />
    </form>
  );
};

export default ConventionalGlobalDietDetails;
