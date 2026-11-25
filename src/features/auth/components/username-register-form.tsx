import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, normalizeApiError } from "@/shared/api";
import { sendCode } from "../api/auth.api";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextBox from "@/shared/base-components/text-box";
import Button from "@/shared/base-components/button";
import { cn } from "@/shared/lib/utils";
import PasswordTextBox from "./password-text-box";
import useUsernameAvailability from "../hooks/use-username-availability.hook";
import {
  UsernameRegisterSchema,
  type UsernameRegister,
} from "../schemas/register.schema";

type UsernameRegisterFormProps = {
  onSuccess: (data: UsernameRegister) => void;
  defaultValues?: UsernameRegister;
};

const UsernameRegisterForm = ({
  onSuccess,
  defaultValues,
}: UsernameRegisterFormProps) => {
  const inFlight = useRef(false);
  const active = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const { mutateAsync: requestCode, isPending } = useMutation({
    mutationFn: async (mobile: string) => {
      const response = await sendCode({ mobile });
      if (response.data?.success !== true) {
        throw new ApiError({
          type: "api",
          message: "ارسال کد تأیید انجام نشد. دوباره تلاش کنید.",
        });
      }
    },
    gcTime: 0,
  });
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<UsernameRegister>({
    resolver: zodResolver(UsernameRegisterSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      mobile: "",
      username: "",
      password: "",
      confirmPassword: "",
      ...defaultValues,
    },
  });
  const username = useWatch({ control, name: "username" });
  const busy = isSubmitting || isPending;
  const availability = useUsernameAvailability(username);
  const availabilityError = errors.username?.type === "availability";

  useEffect(() => {
    if (availability.status === "unavailable") {
      setError("username", {
        type: "availability",
        message: availability.message,
      });
    } else if (availabilityError) {
      clearErrors("username");
    }
  }, [
    availability.status,
    availability.message,
    availabilityError,
    clearErrors,
    setError,
  ]);

  const submit: SubmitHandler<UsernameRegister> = async (data) => {
    if (inFlight.current) return;
    if (
      availability.status !== "available" ||
      availability.username !== data.username
    ) {
      setError("username", {
        type: "availability",
        message: "ابتدا از آزاد بودن نام کاربری مطمئن شوید",
      });
      return;
    }
    inFlight.current = true;
    try {
      await requestCode(data.mobile);
      if (!active.current) return;
      toast.success("کد امنیتی برای شما ارسال شد");
      onSuccess(data);
    } catch (error) {
      if (!active.current) return;
      toast.error(normalizeApiError(error).message);
      inFlight.current = false;
    }
  };

  return (
    <form
      noValidate
      className="auth-form flex h-full min-h-0 flex-col"
      onSubmit={(event) => void handleSubmit(submit)(event)}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pt-10 pb-6">
        <TextBox
          label="شماره تماست رو وارد کن"
          placeHolder="مثال: 09059740858"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          localizePhoneNumber
          classes="login-text-box"
          {...register("mobile")}
          error={errors.mobile?.message}
          aria-invalid={!!errors.mobile}
          disabled={busy}
        />
        <div className="flex shrink-0 flex-col gap-1.5">
          <TextBox
            label="نام کاربری"
            placeHolder="نام کاربری خودت انگلیسی وارد کن"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            classes={cn(
              "login-text-box",
              availability.status === "available" && "border-green-500!",
              availability.status === "unavailable" &&
                "border-red-400! bg-red-400/10!",
            )}
            {...register("username")}
            error={errors.username?.message}
            aria-invalid={
              !!errors.username || availability.status === "unavailable"
            }
            aria-describedby="register-username-status"
            aria-busy={availability.status === "checking"}
            disabled={busy}
          />
          <div
            id="register-username-status"
            aria-live="polite"
            className="px-3 text-sm text-blue-500 empty:hidden"
          >
            {(availability.status === "debouncing" ||
              availability.status === "checking") &&
              "در حال بررسی نام کاربری..."}
            {availability.status === "available" && availability.message}
            {availability.status === "error" && (
              <span>
                {availability.message}{" "}
                <button
                  type="button"
                  onClick={availability.retry}
                  className="cursor-pointer underline underline-offset-4"
                >
                  تلاش مجدد
                </button>
              </span>
            )}
          </div>
        </div>
        <PasswordTextBox
          label="رمز عبور"
          placeHolder="حداقل ۸ کاراکتر (حروف انگلیسی و عدد)"
          autoComplete="new-password"
          classes="login-text-box"
          {...register("password", {
            deps: isSubmitted ? "confirmPassword" : undefined,
          })}
          error={errors.password?.message}
          aria-invalid={!!errors.password}
          disabled={busy}
        />
        <PasswordTextBox
          label="تکرار رمز عبور"
          placeHolder="رمز عبورت رو دوباره وارد کن"
          autoComplete="new-password"
          classes="login-text-box"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          aria-invalid={!!errors.confirmPassword}
          disabled={busy}
        />
      </div>
      <div className="shrink-0 bg-darker-blue-200 px-4 pt-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          title="ثبت نام"
          classes="btn btn-primary-green login-action disabled:bg-green-400! disabled:text-black! disabled:cursor-not-allowed"
          disable={busy}
          loading={busy}
        />
      </div>
    </form>
  );
};

export default UsernameRegisterForm;
