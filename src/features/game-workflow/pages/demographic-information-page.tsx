import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { PiCity, PiForkKnife, PiPersonSimpleRun } from "react-icons/pi";
import QuestionCard from "../components/question-card";
import Button from "@/shared/base-components/button";
import NumberCounter from "@/shared/base-components/number-counter";
import ComboBox from "@/shared/base-components/combo-box";
import { iranProvinceCities } from "@/shared/lib/iran-province-cities";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  demographicInformationFormSchema,
  type DemographicInformationForm,
} from "../schemas/demographic-informations.schema";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDemographicInformation } from "../api/demographic-information.api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { normalizeApiError } from "@/shared/api";

const provinces = iranProvinceCities.map(({ province }) => ({
  value: province,
  label: province,
}));

const DemographicInformationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      sportDayPerWeek: 3,
      province: "",
      city: "",
      dietIncomePercent: 20,
    },
    resolver: zodResolver(demographicInformationFormSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addDemographicInformation,
    onSuccess: async () => {
      toast.success("پرسشنامه اولیه با موفقیت به اتمام رسید");
      await queryClient.invalidateQueries({
        queryKey: ["roadMapList"],
      });
      navigate("/game-workflow");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const formFields = useWatch({ control });

  const cities = useMemo(() => {
    return (
      iranProvinceCities
        .find((ipc) => ipc.province === formFields.province)
        ?.cities.map((city) => ({
          value: city,
          label: city,
        })) ?? []
    );
  }, [formFields.province]);

  const onAddDemographicInformationHandler: SubmitHandler<
    DemographicInformationForm
  > = (data) => mutate(data);

  return (
    <PlaygroundFlowContainer>
      <form
        onSubmit={handleSubmit(onAddDemographicInformationHandler)}
        className="w-full h-full flex flex-col justify-between items-center gap-2"
      >
        <ScrollFade>
          <div className="flex-1 w-full flex flex-col justify-start items-center gap-3">
            <QuestionCard
              icon={
                <PiPersonSimpleRun className="text-green-600 compact:text-5xl fold:text-6xl laptop:text-7xl" />
              }
              title="چند روز ورزش در هفته؟"
              isRequiredField
            >
              <Controller
                name="sportDayPerWeek"
                control={control}
                render={({ field }) => (
                  <ul className="bg-darker-blue-400 text-white w-full rounded-2xl py-2 px-3 flex flex-row justify-between items-center">
                    {Array.from({ length: 8 }).map((_, index) => {
                      const selected = field.value === index;
                      return (
                        <li
                          key={index}
                          className={`w-full text-green-400 ${selected && "border border-green-400"} rounded-xxs font-rokh text-3xl pt-1 px-1.5 text-center`}
                          onClick={() => field.onChange(index)}
                        >
                          {index}
                        </li>
                      );
                    })}
                  </ul>
                )}
              />
            </QuestionCard>
            <QuestionCard
              icon={
                <PiCity className="text-green-600 compact:text-5xl fold:text-6xl laptop:text-7xl" />
              }
              title="کجا زندگی میکنی؟"
            >
              <div className="w-full flex flex-row justify-center items-center gap-4">
                <Controller
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      placeholder="استان"
                      options={provinces}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <ComboBox
                      placeholder="شهر"
                      options={cities}
                      value={field.value}
                      disabled={
                        formFields.province === "" ||
                        formFields.province === undefined
                      }
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </QuestionCard>
            <QuestionCard
              icon={
                <PiForkKnife className="text-green-600 compact:text-5xl fold:text-6xl laptop:text-7xl" />
              }
              title="سهم خوراک از هزینه‌ها؟"
            >
              <Controller
                name="dietIncomePercent"
                control={control}
                render={({ field }) => (
                  <NumberCounter
                    suffix="%"
                    suffixClasses="text-green-400 text-8xl font-rokh"
                    valueClasses="pt-1.5!"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </QuestionCard>
          </div>
        </ScrollFade>
        <Button
          type="submit"
          classes="btn btn-primary-green"
          title="تایید"
          disable={isPending}
        />
      </form>
    </PlaygroundFlowContainer>
  );
};

export default DemographicInformationPage;
