import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSaveProfile from "../../hooks/use-save-profile.hook";
import BaseDrawer from "@/shared/base-components/base-drawer";
import TextBox from "@/shared/base-components/text-box";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import { PiUserFill, PiPlus, PiCheck } from "react-icons/pi";
import { toast } from "sonner";
import useProfileAvatarsQuery from "../../hooks/use-profile-avatars-query.hook";
import { cn } from "@/shared/lib/utils";
import { normalizeApiError } from "@/shared/api";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import useUserProfileQuery from "@/shared/hooks/use-user-profile-query.hook";
import type { User } from "@/features/game-workflow/api/user.types";
import {
  ProfileIdentitySchema,
  type ProfileIdentity,
} from "@/features/onboarding/schemas/basic-information.schema";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";

const defaults = (user: User): ProfileIdentity => ({
  name: user.name ?? "",
  avatar: user.avatar ?? null,
});

function IdentityForm({
  user,
  onSaved,
  onBusyChange,
  open,
}: {
  user: User;
  open: boolean;
  onSaved: () => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProfileIdentity>({
    resolver: zodResolver(ProfileIdentitySchema),
    defaultValues: defaults(user),
  });
  // Subscribe to dirty fields so a background refresh only resets untouched fields.
  void dirtyFields;
  useEffect(() => {
    reset(defaults(user), { keepDirtyValues: true });
  }, [user, reset]);
  const avatars = useProfileAvatarsQuery(open);
  const { submit, isPending } = useSaveProfile(onSaved, onBusyChange);
  return (
    <form
      id="profile-identity"
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      aria-busy={isPending}
    >
      <fieldset
        disabled={isPending}
        inert={isPending}
        className="flex min-w-0 flex-col gap-3 disabled:opacity-60"
      >
        <TextBox
          inlineLabel
          label="نام و نشان"
          placeHolder="نام و نشان"
          {...register("name")}
          error={errors.name?.message}
          labelClasses="text-darker-green-200! dark:text-white! text-[20px]! leading-[1.2]!"
          classes="rounded-[20px]! bg-blue-300! border-blue-500! text-blue-900! dark:bg-darker-blue-400! dark:border-darker-blue-100!"
        />
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <div
              role="group"
              aria-label="انتخاب تصویر پروفایل"
              className="grid grid-cols-4 justify-items-center gap-x-3 gap-y-[14px]"
            >
              <button
                type="button"
                aria-label="افزودن تصویر از گالری یا دوربین"
                onClick={() => toast.info("این قابلیت هنوز در دسترس نیست.")}
                className="relative size-16 max-w-full rounded-full border border-dark bg-darker-blue-400 outline-none"
              >
                <span className="block size-full overflow-hidden rounded-full">
                  <PiUserFill className="size-full translate-y-[10%] scale-110 text-darker-blue-100" />
                </span>
                <span className="absolute bottom-0 right-0 flex size-4 items-center justify-center rounded-full bg-blue-500 text-black">
                  <PiPlus size={12} />
                </span>
              </button>
              {avatars.isPending
                ? Array.from({ length: 7 }, (_, index) => (
                    <span
                      key={index}
                      className="size-16 max-w-full rounded-full bg-blue-500/25 motion-safe:animate-pulse"
                    />
                  ))
                : avatars.data?.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      aria-label={"تصویر پروفایل " + (index + 1)}
                      aria-pressed={field.value === src}
                      onClick={() =>
                        field.onChange(field.value === src ? null : src)
                      }
                      className={cn(
                        "relative size-16 max-w-full rounded-full border border-dark bg-darker-blue-400 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400",
                        field.value === src && "border-2 border-blue-400",
                      )}
                    >
                      <ImageWithSkeleton
                        src={src}
                        alt=""
                        wrapperClassName="size-full rounded-full"
                        className="size-full object-cover"
                      />
                      {field.value === src && (
                        <span className="absolute bottom-0 right-0 flex size-4 items-center justify-center rounded-full bg-blue-500 text-black shadow-sm dark:hidden">
                          <PiCheck size={12} />
                        </span>
                      )}
                    </button>
                  ))}
            </div>
          )}
        />
        {avatars.isError && (
          <div role="alert" className="text-center text-sm">
            <p>{normalizeApiError(avatars.error).message}</p>
            <button
              type="button"
              onClick={() => void avatars.refetch()}
              className="text-blue-800 outline-none dark:text-blue-400"
            >
              تلاش دوباره
            </button>
          </div>
        )}
      </fieldset>
      <div className="-mx-3 mt-4 border-t border-blue-500/60 px-3 pt-4 dark:border-darker-blue-100">
        <button
          type="submit"
          disabled={isPending}
          className="h-[42px] w-full cursor-pointer rounded-[20px] bg-green-400 font-peyda text-lg font-bold text-black outline-none disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "در حال ثبت…" : "ثبت اطلاعات"}
        </button>
      </div>
    </form>
  );
}

export default function ProfileIdentity({
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
      title="تغییر اسم و عکس پروفایل"
      theme={theme}
      className="bg-[#c3e6f3] dark:bg-darker-blue-200 [--scroll-fade-color:#c3e6f3] dark:[--scroll-fade-color:var(--color-darker-blue-200)] [&_[data-slot=base-drawer-body]]:px-3 [&_[data-slot=base-drawer-body]]:py-4 [&_[data-slot=drawer-title]]:text-[20px] [&_[data-slot=drawer-title]]:leading-[1.2]"
    >
      {user ? (
        <IdentityForm
          open={open}
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
            className="text-blue-700 outline-none dark:text-blue-400"
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
