import { useEffect, useState } from "react";
import MainContainer from "../components/main-container";
import { easeInOut, motion } from "framer-motion";
import TextBox from "../../../shared/base-components/text-box";
import Radio from "../../../shared/base-components/radio";
import { LiaFemaleSolid, LiaMaleSolid } from "react-icons/lia";
import Button from "../../../shared/base-components/button";
import NumberPicker from "../../../shared/base-components/number-picker";
import RulerBox from "../../../shared/base-components/ruler-box";
import { useOutletContext } from "react-router-dom";
import type { AuthOutletContext } from "../../../layouts/auth-layout";
import {
  Controller,
  useForm,
  type FieldPath,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DemographicInformationSchema,
  type DemographicInformation,
} from "../schemas/demographic-information.schema";
import CheckBox from "../../../shared/base-components/check-box";

const genderOptions = [
  {
    title: "آقا",
    value: 1,
    icon: <LiaMaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
  {
    title: "خانم",
    value: 2,
    icon: <LiaFemaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
];

const mainGoalOptions = [
  { title: "کاهش وزن", value: "weight-loss" },
  { title: "حفظ وزن", value: "weight-maintenance" },
  { title: "افزایش وزن", value: "weight-gain" },
];

const focusOptions = [
  { title: "عضله سازی", value: "muscle-building" },
  { title: "تغذیه سالم", value: "healthy-eating" },
  { title: "محیط زیست", value: "environment" },
  { title: "سایر...", value: "others" },
];

const stepOneFields: FieldPath<DemographicInformation>[] = [
  "name",
  "sex",
  "weight",
  "height",
  "age",
];

const DemographicInformation = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();
  const [step, setStep] = useState<1 | 2>(1);

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
      height: 100,
      age: 0,
      mainGoal: "",
      focus: [],
    },
  });

  useEffect(() => {
    if (step === 2) {
      setBackHandler(() => {
        setStep(1);
      });
    }

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  const onNextStepHandler = async () => {
    const isStepOneValid = await trigger(stepOneFields, {
      shouldFocus: true,
    });
    if (!isStepOneValid) return;

    setStep(2);
  };

  const onDemographicInformationFormHandler: SubmitHandler<
    DemographicInformation
  > = () => {};

  return (
    <MainContainer isFirstStep={step === 1} isLastStep={step === 2}>
      {step === 1 ? (
        <motion.div
          key="step-1"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="flex
                    h-full
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    flex-col
                    items-start
                    justify-between
                    gap-4
                    overflow-x-clip
                    compact:px-4
                    mobile-lg:px-6
                    will-change-[transform,opacity]"
        >
          <div
            className="flex 
                          w-full 
                          min-w-0 
                          max-w-none 
                          flex-col 
                          items-center 
                          justify-start 
                          gap-2.5
                          overflow-x-hidden 
                          overflow-y-auto 
                          scrollbar-none 
                          [-ms-overflow-style:none] 
                          [&::-webkit-scrollbar]:hidden"
          >
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
                  subLabel="(سانتی متر)"
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
              name="age"
              control={control}
              render={({ field }) => (
                <NumberPicker
                  label="سن"
                  min={0}
                  max={100}
                  value={field.value}
                  onChangeEnd={field.onChange}
                  error={errors.age?.message}
                />
              )}
            />
          </div>
          <Button
            classes="btn btn-primary"
            title="مرحله بعد"
            onClick={onNextStepHandler}
          />
        </motion.div>
      ) : (
        <motion.form
          key="step-2"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="flex
                    h-full
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    flex-col
                    items-start
                    justify-start
                    gap-6
                    overflow-x-clip
                    compact:px-4
                    mobile-lg:px-6
                    will-change-[transform,opacity]"
          onSubmit={handleSubmit(onDemographicInformationFormHandler)}
        >
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
          <div className="w-full h-full flex flex-col justify-end">
            <Button
              type="submit"
              classes="btn btn-primary"
              title="ثبت اطلاعات"
            />
          </div>
        </motion.form>
      )}
    </MainContainer>
  );
};

export default DemographicInformation;
