import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Controller,
  useForm,
  type FieldPath,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LiaFemaleSolid, LiaMaleSolid } from "react-icons/lia";

import MainContainer from "../components/main-container";
import TextBox from "../../../shared/base-components/text-box";
import Radio from "../../../shared/base-components/radio";
import Button from "../../../shared/base-components/button";
import NumberPicker from "../../../shared/base-components/number-picker";
import RulerBox from "../../../shared/base-components/ruler-box";
import CheckBox from "../../../shared/base-components/check-box";

import type { AuthOutletContext } from "../../../layouts/auth-layout";

import {
  DemographicInformationSchema,
  type DemographicInformation,
} from "../schemas/demographic-information.schema";
import { BirthDatePicker } from "../../../shared/base-components/date-picker";
import { useMutation } from "@tanstack/react-query";
import { addDemographicInformation } from "../services/user.service";
import ScrollFade from "../../../shared/base-components/scroll-fade";
import { normalizeApiError } from "../../../shared/api";
import { toast } from "sonner";

const genderOptions = [
  {
    title: "آقا",
    value: "male",
    icon: <LiaMaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
  {
    title: "خانم",
    value: "female",
    icon: <LiaFemaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
];

const mainGoalOptions = [
  {
    title: "کاهش وزن",
    value: "weight-loss",
  },
  {
    title: "حفظ وزن",
    value: "weight-maintenance",
  },
  {
    title: "افزایش وزن",
    value: "weight-gain",
  },
];

const focusOptions = [
  {
    title: "عضله سازی",
    value: "muscle-building",
  },
  {
    title: "تغذیه سالم",
    value: "healthy-eating",
  },
  {
    title: "محیط زیست",
    value: "environment",
  },
  {
    title: "سایر...",
    value: "others",
  },
];

const stepOneFields: FieldPath<DemographicInformation>[] = [
  "name",
  "sex",
  "weight",
  "height",
  "birthDate",
];

const DemographicInformation = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<DemographicInformation>({
    resolver: zodResolver(DemographicInformationSchema),

    defaultValues: {
      name: "",
      sex: undefined,
      weight: 70,
      height: 150,
      birthDate: "",
      mainGoal: "",
      focus: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addDemographicInformation,
    onSuccess: () => {
      toast.success("اطلاعات پایه با موفقیت تکمیل شد");
      navigate("/auth/choose-plan");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  useEffect(() => {
    setBackHandler(
      step === 2
        ? () => {
            setStep(1);
          }
        : null,
    );

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  const handleNextStep = async () => {
    const isValid = await trigger(stepOneFields, {
      shouldFocus: true,
    });

    if (!isValid) {
      return;
    }

    setStep(2);
  };

  const handleFormSubmit: SubmitHandler<DemographicInformation> = (data) => {
    mutate(data);
  };

  return (
    <MainContainer
      stepKey={step}
      isFirstStep={step === 1}
      isLastStep={step === 2}
      scrollMode="child"
    >
      <form
        className="flex h-full min-h-0 w-full flex-col"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <ScrollFade>
          <div
            className="
            min-h-0
            w-full
            flex-1
            overflow-x-hidden
            overflow-y-auto
            scrollbar-none
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          "
          >
            {step === 1 ? (
              <div className="flex w-full flex-col items-center gap-2.5">
                <TextBox
                  inlineLabel
                  label="نام و نشان"
                  placeHolder="مثال: پارسا متینی"
                  {...register("name")}
                  error={errors.name?.message}
                />

                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <Radio
                      inlineLabel
                      label="جنسیت"
                      gridClasses="grid-cols-2 gap-1"
                      options={genderOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.sex?.message}
                    />
                  )}
                />

                <Controller
                  name="weight"
                  control={control}
                  render={({ field }) => (
                    <NumberPicker
                      label="وزن"
                      subLabel="(کیلوگرم)"
                      min={0}
                      max={200}
                      value={field.value}
                      onChangeEnd={field.onChange}
                      error={errors.weight?.message}
                    />
                  )}
                />

                <Controller
                  name="height"
                  control={control}
                  render={({ field }) => (
                    <RulerBox
                      label="قد"
                      subLabel="(سانتی‌متر)"
                      min={100}
                      max={220}
                      step={1}
                      majorStep={5}
                      value={field.value}
                      onChangeEnd={field.onChange}
                      error={errors.height?.message}
                    />
                  )}
                />

                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field, fieldState }) => (
                    <BirthDatePicker
                      ref={field.ref}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      error={fieldState.error?.message}
                      label="تاریخ تولد"
                    />
                  )}
                />
              </div>
            ) : (
              <div className="flex w-full flex-col gap-4">
                <Controller
                  name="mainGoal"
                  control={control}
                  render={({ field }) => (
                    <Radio
                      label="هدف اصلی تو چیه؟"
                      subLabel="(فقط یک انتخاب)"
                      gridClasses="grid-cols-3 gap-1"
                      options={mainGoalOptions}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.mainGoal?.message}
                    />
                  )}
                />

                <Controller
                  name="focus"
                  control={control}
                  render={({ field }) => (
                    <CheckBox
                      label="دوست داری روی چیا بیشتر تمرکز کنیم؟"
                      gridClasses="grid-cols-3 gap-1"
                      options={focusOptions}
                      values={field.value}
                      onChange={field.onChange}
                      error={errors.focus?.message}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </ScrollFade>
        <div className="w-full shrink-0 pt-4">
          {step === 1 ? (
            <Button
              type="button"
              classes="btn btn-primary-green w-full"
              title="مرحله بعد"
              onClick={handleNextStep}
            />
          ) : (
            <Button
              type="submit"
              classes="btn btn-primary-green w-full"
              title="ثبت اطلاعات"
            />
          )}
        </div>
      </form>
    </MainContainer>
  );
};

export default DemographicInformation;
