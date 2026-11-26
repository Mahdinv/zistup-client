import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { resetForgotPassword } from "../api/auth.api";
import type {
  PasswordResetGrant,
  ResetForgotPasswordResult,
} from "../api/auth.types";
import useRecoveryMutation from "../hooks/use-recovery-mutation.hook";
import { normalizeApiError } from "@/shared/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/shared/base-components/button";
import PasswordTextBox from "./password-text-box";
import {
  PasswordConfirmationSchema,
  type ResetPassword,
} from "../schemas/register.schema";

const ResetPasswordForm = ({
  values,
  onChange,
  grant,
  onExpired,
  onSuccess,
}: {
  values: ResetPassword;
  onChange: (values: Partial<ResetPassword>) => void;
  grant: PasswordResetGrant;
  onExpired: () => void;
  onSuccess: (result: ResetForgotPasswordResult) => void;
}) => {
  const { submit, isPending } = useRecoveryMutation(
    resetForgotPassword,
    onSuccess,
    (error) => {
      const { status } = normalizeApiError(error);
      if (Date.now() >= grant.expiresAt || status === 401 || status === 403)
        onExpired();
    },
  );
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      const remaining = grant.expiresAt - Date.now();
      if (remaining <= 0) {
        onExpired();
        return;
      }
      timer = setTimeout(checkExpiration, Math.min(remaining, 2147483647));
    };
    checkExpiration();
    return () => clearTimeout(timer);
  }, [grant.expiresAt, onExpired]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<ResetPassword>({
    resolver: zodResolver(PasswordConfirmationSchema),
    defaultValues: values,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  return (
    <form
      noValidate
      className="auth-form flex h-full min-h-0 flex-col"
      onSubmit={(event) =>
        void handleSubmit(({ password }) => {
          if (Date.now() >= grant.expiresAt) {
            onExpired();
            return;
          }
          submit({ reset_token: grant.token, password });
        })(event)
      }
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-10 pb-6">
        <PasswordTextBox
          label="رمز عبور جدید رو وارد کن."
          placeHolder="حداقل ۸ کاراکتر (حروف انگلیسی و عدد)"
          classes="login-text-box"
          autoComplete="new-password"
          {...register("password", {
            deps: isSubmitted ? "confirmPassword" : undefined,
            onChange: (event) => onChange({ password: event.target.value }),
          })}
          error={errors.password?.message}
          aria-invalid={!!errors.password}
          disabled={isPending}
        />
        <PasswordTextBox
          label="تکرار رمز عبور"
          placeHolder="رمز عبورت رو دوباره وارد کن"
          classes="login-text-box"
          autoComplete="new-password"
          {...register("confirmPassword", {
            onChange: (event) =>
              onChange({ confirmPassword: event.target.value }),
          })}
          error={errors.confirmPassword?.message}
          aria-invalid={!!errors.confirmPassword}
          disabled={isPending}
        />
      </div>
      <div className="shrink-0 px-4 pt-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          title="تایید"
          classes="btn btn-primary-green login-action"
          loading={isPending}
          disable={isPending}
        />
      </div>
    </form>
  );
};
export default ResetPasswordForm;
