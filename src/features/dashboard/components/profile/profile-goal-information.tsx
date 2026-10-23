import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSaveProfile from "../../hooks/use-save-profile.hook";
import BaseDrawer from "@/shared/base-components/base-drawer";
import Radio from "@/shared/base-components/radio";
import CheckBox from "@/shared/base-components/check-box";
import {
  mainGoalOptions,
  focusOptions,
} from "@/shared/constants/basic-information-options";
import { normalizeApiError } from "@/shared/api";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import useUserProfileQuery from "@/shared/hooks/use-user-profile-query.hook";
import type { User } from "@/features/game-workflow/api/user.types";
import {
  ProfileGoalInformationSchema,
  type ProfileGoalInformation,
} from "@/features/onboarding/schemas/basic-information.schema";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";

const optionClasses =
  "grid-cols-3 gap-2 [&>div]:h-12 [&>div]:rounded-[20px] [&>div]:py-0 [&_label]:mt-0 [&_label]:font-bold [&>div]:bg-blue-300 [&>div]:border-blue-300 [&>div]:text-blue-600 [&>div]:shadow-[0_4px_4px_rgba(0,0,0,0.04)] dark:[&>div]:bg-darker-blue-400 dark:[&>div]:border-blue-900 dark:[&>div]:text-blue-500 dark:[&>div]:shadow-none [&>div.ring-1]:bg-blue-500 dark:[&>div.ring-1]:bg-blue-700 [&>div.ring-1]:border-blue-400 [&>div.ring-1]:text-darker-green-200";
const defaults = (user: User): ProfileGoalInformation => ({
  mainGoal: user.mainGoal ?? "",
  focus: user.focus ?? [],
});

function GoalInformationForm({
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
  } = useForm<ProfileGoalInformation>({
    resolver: zodResolver(ProfileGoalInformationSchema),
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
      id="profile-goal-information"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      aria-busy={isPending}
    >
      <fieldset
        disabled={isPending}
        inert={isPending}
        className="flex min-w-0 flex-col gap-6 disabled:opacity-60 [&_.font-yekan]:text-[20px] [&_.font-yekan]:leading-[1.2] [&_.font-yekan]:text-darker-green-200 dark:[&_.font-yekan]:text-white [&>div>div]:gap-3"
      >
        <Controller
          name="mainGoal"
          control={control}
          render={({ field }) => (
            <Radio
              label="هدف اصلی تو چیه؟ (فقط یک انتخاب)"
              gridClasses={optionClasses}
              variant="blue"
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
              gridClasses={optionClasses}
              options={focusOptions}
              values={field.value}
              onChange={field.onChange}
              error={errors.focus?.message}
            />
          )}
        />
      </fieldset>
      <div className="-mx-3 mt-4 border-t border-blue-500/60 px-3 pt-4 dark:border-darker-blue-100">
        <button
          type="submit"
          disabled={isPending}
          className="h-[42px] w-full cursor-pointer rounded-[20px] bg-green-400 font-peyda text-lg font-bold text-black disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "در حال ثبت…" : "ثبت اطلاعات"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileGoalInformation({
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
      title="انتخاب هدف"
      theme={theme}
      className="bg-[#c3e6f3] dark:bg-darker-blue-200 [--scroll-fade-color:#c3e6f3] dark:[--scroll-fade-color:var(--color-darker-blue-200)] [&_[data-slot=base-drawer-body]]:px-3 [&_[data-slot=base-drawer-body]]:py-4 [&_[data-slot=drawer-title]]:text-[20px] [&_[data-slot=drawer-title]]:leading-[1.2]"
    >
      {user ? (
        <GoalInformationForm
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
          className="h-80 animate-pulse rounded-[20px] bg-blue-500/20 motion-reduce:animate-none"
        />
      )}
    </BaseDrawer>
  );
}
