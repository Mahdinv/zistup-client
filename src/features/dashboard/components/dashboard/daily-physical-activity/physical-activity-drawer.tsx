import { useId, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { PiFireSimpleFill, PiXCircle } from "react-icons/pi";
import BaseDrawer from "@/shared/base-components/base-drawer";
import NumberCounter from "@/shared/base-components/number-counter";

import { useDashboardTheme } from "../../../hooks/use-dashboard-theme.hook";
import type {
  Exercise,
  PhysicalActivitySubmission,
} from "../../../api/types/exercise.types";
import { estimateActivityCalories } from "../../../lib/physical-activity.utils";
import ExerciseSearch from "./exercise-search";

type FormValues = { exercise: Exercise | null; durationMinutes: number };
type Props = {
  open: boolean;
  pending: boolean;
  onClose: () => void;
  onSubmit: (submission: PhysicalActivitySubmission) => Promise<boolean>;
};

export default function PhysicalActivityDrawer({
  open,
  pending,
  onClose,
  onSubmit,
}: Props) {
  const { theme } = useDashboardTheme();
  const formId = useId();
  const submitted = useRef(false);
  const [searchSession, setSearchSession] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<FormValues>({
    defaultValues: { exercise: null, durationMinutes: 15 },
  });
  const isSubmitting = pending || isFormSubmitting;
  const [exercise, minutes] = useWatch({
    control,
    name: ["exercise", "durationMinutes"],
  });
  const weight = useUserProfileStore((state) => state.user?.weight);
  const calories = estimateActivityCalories(exercise, minutes, weight);
  const submit = (event: React.FormEvent<HTMLFormElement>) =>
    handleSubmit(async (values) => {
      if (!values.exercise || submitted.current) return;
      submitted.current = true;
      const success = await onSubmit({
        exercise: values.exercise,
        durationMinutes: values.durationMinutes,
        calories: estimateActivityCalories(
          values.exercise,
          values.durationMinutes,
          weight,
        ),
      });
      if (success) onClose();
      else submitted.current = false;
    })(event);
  return (
    <BaseDrawer
      open={open}
      onOpenChange={(next) => {
        if (!next && !isSubmitting) onClose();
      }}
      onOpenChangeComplete={(isOpen) => {
        if (isOpen || open) return;
        reset();
        submitted.current = false;
        setSearchSession((session) => session + 1);
      }}
      title="ثبت فعالیت ورزشی امروز"
      description="انتخاب فعالیت ورزشی و مدت فعالیت"
      theme={theme}
      closeIcon={<PiXCircle aria-hidden className="size-6" />}
      className="has-[[role=combobox][aria-expanded=true]]:h-[516px] bg-[#c3e6f3] [--scroll-fade-color:#c3e6f3] [&>div>header]:relative [&>div>header]:z-30 [&>div>header]:px-3 [&>div>header]:pb-4 [&_[data-slot=drawer-title]]:text-[20px] [&_[data-slot=drawer-title]]:leading-[1.2] [&_[data-slot=drawer-close]]:size-8 [&_[data-slot=base-drawer-body]]:px-3 [&_[data-slot=base-drawer-body]]:py-4 [&_[data-slot=base-drawer-footer]]:px-3 [&_[data-slot=base-drawer-footer]]:pt-3"
      headerContent={
        <Controller
          name="exercise"
          control={control}
          rules={{ required: "لطفاً یک فعالیت انتخاب کنید." }}
          render={({ field }) => (
            <ExerciseSearch
              key={searchSession}
              open={open}
              value={field.value}
              onChange={field.onChange}
              error={errors.exercise?.message}
            />
          )}
        />
      }
      footer={
        <button
          type="submit"
          form={formId}
          aria-busy={isSubmitting}
          disabled={isSubmitting}
          className="h-10.5 w-full cursor-pointer rounded-2xl bg-orange-200 text-xl font-bold text-darker-green-200 hover:bg-orange-300 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-orange-300"
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت این فعالیت"}
        </button>
      }
    >
      <form id={formId} onSubmit={submit} className="flex flex-col gap-6">
        <Controller
          name="durationMinutes"
          control={control}
          rules={{
            required: "مدت فعالیت را وارد کنید.",
            min: { value: 1, message: "مدت فعالیت باید حداقل یک دقیقه باشد." },
            max: {
              value: 1440,
              message: "مدت فعالیت نمی‌تواند بیشتر از یک روز باشد.",
            },
            validate: (value) =>
              Number.isInteger(value) || "مدت فعالیت باید عدد صحیح باشد.",
          }}
          render={({ field }) => (
            <NumberCounter
              label="مدت فعالیت"
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              min={1}
              max={1440}
              suffix="دقیقه"
              wrapperClasses="w-full gap-2!"
              labelClasses="text-base! text-darker-green-200! dark:text-gray-200! font-peyda! pr-3"
              counterClasses="w-full bg-blue-300! dark:bg-darker-blue-400! shadow-[0_4px_4px_0_#0000000a] dark:shadow-none"
              valueClasses="text-[42px]! leading-none! text-orange-200! min-w-0! translate-y-[0.14em]"
              controlsClasses="w-auto! pt-0!"
              suffixClasses="text-sm"
              plusButtonClasses="bg-darker-blue-200!"
              minusButtonClasses="bg-darker-blue-200!"
              plusIconClasses="text-white! text-[20px]!"
              minusIconClasses="text-[20px]!"
            />
          )}
        />
        {errors.durationMinutes && (
          <p role="alert" className="text-red-400">
            {errors.durationMinutes.message}
          </p>
        )}
        <div className="flex min-h-15.75 items-center justify-between gap-2 rounded-2xl bg-darker-blue-200 py-2 px-3 text-orange-200 dark:bg-darker-blue-500">
          <span className="flex items-center gap-1 text-base font-bold">
            <PiFireSimpleFill
              aria-hidden
              className="size-9 shrink-0 text-orange-300"
            />
            تخمین کالری‌سوزی
          </span>
          <output aria-live="polite" className="flex items-center gap-2">
            <small className="font-yekan text-sm font-extrabold text-white">
              kcal
            </small>
            <span className="font-rokh text-[42px] leading-none translate-y-[0.14em]">
              {calories ?? "—"}
            </span>
          </output>
        </div>
        {exercise && calories === null && (
          <p className="text-sm text-blue-900 dark:text-blue-500">
            برای تخمین کالری‌سوزی، وزن معتبر در پروفایل لازم است.
          </p>
        )}
      </form>
    </BaseDrawer>
  );
}
