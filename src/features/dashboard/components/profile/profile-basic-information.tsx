import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSaveProfile from "../../hooks/use-save-profile.hook";
import BaseDrawer from "@/shared/base-components/base-drawer";
import Radio from "@/shared/base-components/radio";
import NumberPicker from "@/shared/base-components/number-picker";
import RulerBox from "@/shared/base-components/ruler-box";
import { BirthDatePicker } from "@/shared/base-components/date-picker";
import { genderOptions } from "@/shared/constants/basic-information-options";
import { normalizeApiError } from "@/shared/api";
import { cn } from "@/shared/lib/utils";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import useUserProfileQuery from "@/shared/hooks/use-user-profile-query.hook";
import type { User } from "@/features/game-workflow/api/user.types";
import {
  ProfileBasicInformationSchema,
  type ProfileBasicInformation,
} from "@/features/onboarding/schemas/basic-information.schema";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";

const defaults = (user: User): ProfileBasicInformation => ({
  sex: user.sex,
  weight: user.weight ?? 70,
  height: user.height ?? 150,
  birthDate: user.birthDate?.split("T")[0] ?? "",
});

function BasicInformationForm({
  user,
  onSaved,
  onBusyChange,
}: {
  user: User;
  onSaved: () => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProfileBasicInformation>({
    resolver: zodResolver(ProfileBasicInformationSchema),
    defaultValues: defaults(user),
  });
  // Subscribe to dirty fields so a background refresh only resets untouched fields.
  void dirtyFields;
  useEffect(() => {
    reset(defaults(user), { keepDirtyValues: true });
  }, [user, reset]);
  const { submit, isPending } = useSaveProfile(onSaved, onBusyChange);
  return (
    <form
      id="profile-basic-information"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      aria-busy={isPending}
    >
      <fieldset
        disabled={isPending}
        inert={isPending}
        className="flex min-w-0 flex-col gap-2 [&_[role=spinbutton]_span.w-px]:bg-blue-900 dark:[&_[role=spinbutton]_span.w-px]:bg-white/90 [&_[role=spinbutton]_span.w-10]:text-blue-900/60 dark:[&_[role=spinbutton]_span.w-10]:text-white/45 [&_[role=spinbutton]>div.keen-slider]:h-12 **:[[role=group]]:h-17.5 [&_.font-yekan>span.font-peyda]:text-xs [&_.text-right>span.font-peyda]:text-xs [&_[role=spinbutton]:has(output)]:h-23 disabled:opacity-60 [&_.text-white]:text-dark dark:[&_.text-white]:text-white **:[[role=spinbutton]]:rounded-2xl **:[[role=spinbutton]]:border-blue-500 dark:**:[[role=spinbutton]]:border-darker-blue-100 **:[[role=spinbutton]]:bg-blue-100 dark:**:[[role=spinbutton]]:bg-darker-blue-400 **:[[role=group]]:rounded-2xl **:[[role=group]]:bg-blue-100 dark:**:[[role=group]]:bg-darker-blue-400"
      >
        <Controller
          name="sex"
          control={control}
          render={({ field }) => (
            <Radio
              inlineLabel
              label="جنسیت"
              gridClasses="grid-cols-2 gap-2 [&_label]:mt-0 [&>div]:rounded-[20px] [&>div]:h-12 [&>div]:py-0 [&>div]:bg-blue-100 dark:[&>div]:bg-darker-blue-400 [&>div.ring-1]:bg-blue-700 [&>div.ring-1]:text-black"
              variant="blue"
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
              label="سن"
            />
          )}
        />
      </fieldset>
      <div className="-mx-3 mt-4 border-t border-blue-500/60 px-3 pt-4 dark:border-darker-blue-100">
        <button
          type="submit"
          disabled={isPending}
          className="h-10.5 w-full cursor-pointer rounded-2xl bg-green-400 font-peyda text-lg font-bold text-black disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "در حال ثبت…" : "ثبت اطلاعات"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileBasicInformation({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useUserProfileStore((state) => state.user);
  const query = useUserProfileQuery(open);
  const [saving, setSaving] = useState(false);
  const { theme } = useDashboardTheme();
  return (
    <BaseDrawer
      open={open}
      onOpenChange={(next) => {
        if (!saving) onOpenChange(next);
      }}
      title="اطلاعات پایه"
      theme={theme}
      className={cn(
        "**:data-[slot=base-drawer-body]:px-3 **:data-[slot=base-drawer-body]:pt-4 **:data-[slot=base-drawer-body]:pb-4.5 **:data-[slot=drawer-title]:text-xl",
        theme === "light" &&
          "bg-[#c3e6f3] text-darker-green-200 [--scroll-fade-color:#c3e6f3] [&>div>header]:border-green-400/40 **:data-[slot=drawer-swipe-handle]:after:bg-green-400/40 **:data-[slot=drawer-close]:text-blue-900 [&_form>div]:border-green-400/40 [&_fieldset]:gap-1 [&_fieldset_.font-yekan]:leading-[1.2] [&_fieldset>div>span[id]]:leading-[1.2] [&_fieldset_.font-yekan]:text-[20px] [&_fieldset_.text-right>span.font-peyda]:text-[12px] [&_fieldset_.font-yekan>span.font-peyda]:text-[12px] [&_fieldset>div:first-child_.grid>div]:border-blue-300! [&_fieldset>div:first-child_.grid>div]:bg-blue-300! [&_fieldset>div:first-child_.grid>div]:text-blue-600! [&_fieldset>div:first-child_.grid>div]:shadow-[0_4px_4px_rgba(0,0,0,0.04)] [&_fieldset>div:first-child_.grid>div.ring-1]:border-blue-400! [&_fieldset>div:first-child_.grid>div.ring-1]:bg-blue-500! [&_fieldset>div:first-child_.grid>div.ring-1]:text-darker-green-200! [&_fieldset_[role=spinbutton]]:bg-darker-blue-200! [&_fieldset_[role=spinbutton]]:border-darker-blue-100! [&_fieldset_[role=spinbutton]_.text-white]:text-white! [&_fieldset_[role=spinbutton]_span.w-px]:bg-white/90! [&_fieldset_[role=spinbutton]_span.w-10]:text-white/45! [&_fieldset_[role=spinbutton]_output]:text-blue-400 [&_fieldset_[role=group]]:bg-darker-blue-200! [&_fieldset_[role=group]]:border-dark [&_fieldset_[role=group]_.text-white]:text-white! [&_fieldset_[role=option][aria-selected=true]_.text-white]:text-blue-400! [&_fieldset_[role=spinbutton]>.keen-slider+div]:hidden",
      )}
    >
      {user ? (
        <BasicInformationForm
          user={user}
          onSaved={() => onOpenChange(false)}
          onBusyChange={setSaving}
        />
      ) : query.isError ? (
        <div role="alert" className="space-y-3 text-center">
          <p>{normalizeApiError(query.error).message}</p>
          <button
            type="button"
            onClick={() => void query.refetch()}
            className="text-blue-700 dark:text-blue-400"
          >
            تلاش دوباره
          </button>
        </div>
      ) : (
        <div
          role="status"
          aria-label="در حال دریافت اطلاعات"
          className="h-80 animate-pulse rounded-2xl bg-blue-500/20 motion-reduce:animate-none"
        />
      )}
    </BaseDrawer>
  );
}
