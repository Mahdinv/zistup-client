import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Button from "@/shared/base-components/button";
import OtpBox from "@/shared/base-components/otp-box";
import Timer from "@/shared/base-components/timer";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Otp, OtpSchema } from "../schemas/login.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError, normalizeApiError, tokenStorage } from "../../../shared/api";
import { useNavigate } from "react-router-dom";
import type { AuthIdentifierDTO } from "../api/auth.types";
import { sendCode, validateUser } from "../api/auth.api";
import { getPostAuthPath } from "../loaders/get-post-auth-path";
import { useRef, useState } from "react";
import { PiCircleNotch } from "react-icons/pi";
import { verifyForgotPassword } from "../api/auth.api";
import type { PasswordResetGrant } from "../api/auth.types";
import useRecoveryMutation from "../hooks/use-recovery-mutation.hook";

type AuthenticatedOtpProps = {
  mode?: "authenticate";
  identifier: AuthIdentifierDTO;
  refCode?: string;
  onVerify?: (data: Otp) => ReturnType<typeof validateUser>;
  successPath?: string;
  allowPhoneResend?: boolean;
};

type RecoveryOtpProps = {
  mode: "recovery";
  username: string;
  mobile: string;
  code: string;
  onCodeChange: (code: string) => void;
  onVerified: (grant: PasswordResetGrant) => void;
};

const RecoveryOtpForm = ({
  username,
  mobile,
  code,
  onCodeChange,
  onVerified,
}: RecoveryOtpProps) => {
  const { submit, isPending } = useRecoveryMutation(
    verifyForgotPassword,
    (result) => {
      onVerified({
        token: result.reset_token,
        expiresAt: Date.now() + result.expires_in * 1000,
      });
    },
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string }>({
    resolver: zodResolver(OtpSchema.pick({ code: true })),
    defaultValues: { code },
  });
  return (
    <form
      noValidate
      className="flex h-full min-h-0 flex-col"
      onSubmit={(event) =>
        void handleSubmit(({ code }) => submit({ username, code }))(event)
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-10 pb-6 [&_label]:self-center">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OtpBox
              value={field.value}
              onChange={(value) => {
                field.onChange(value);
                onCodeChange(value);
              }}
              onBlur={field.onBlur}
              error={errors.code?.message}
              length={4}
              phoneNumber={mobile}
              disabled={isPending}
            />
          )}
        />
      </div>
      <div className="auth-form shrink-0 px-4 pt-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
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

const AuthenticatedOtpForm = ({
  identifier,
  refCode,
  onVerify = validateUser,
  successPath,
  allowPhoneResend = false,
}: AuthenticatedOtpProps) => {
  const navigate = useNavigate();
  const inFlight = useRef(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const phoneResendEnabled = allowPhoneResend && !!identifier.mobile;
  const { mutate: resend, isPending: isResending } = useMutation({
    mutationFn: async (mobile: string) => {
      const response = await sendCode({ mobile });
      if (response.data?.success !== true) {
        throw new ApiError({
          type: "api",
          message: "ارسال مجدد کد انجام نشد. دوباره تلاش کنید.",
        });
      }
    },
    gcTime: 0,
    retry: false,
  });

  const handleResend = () => {
    if (
      !phoneResendEnabled ||
      !resendAvailable ||
      !identifier.mobile ||
      inFlight.current
    )
      return;
    inFlight.current = true;
    resend(identifier.mobile, {
      onSuccess: () => {
        inFlight.current = false;
        setResendAvailable(false);
        setCountdownKey((previous) => previous + 1);
        toast.success("کد امنیتی برای شما ارسال شد");
      },
      onError: (error) => {
        inFlight.current = false;
        toast.error(normalizeApiError(error).message);
      },
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Otp>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      identifier: identifier,
      refCode,
      code: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: onVerify,
    gcTime: 0,
    onSuccess: (data) => {
      toast.success("خوش آمدید");
      tokenStorage.set(data.token);
      navigate(successPath ?? getPostAuthPath(data.user));
    },
    onError: (error) => {
      inFlight.current = false;
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const onVerifyOtpHandler: SubmitHandler<Otp> = (data) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutate(data);
  };

  return (
    <form
      className="w-full min-h-0 flex-1 flex flex-col items-start gap-4"
      onSubmit={(event) => void handleSubmit(onVerifyOtpHandler)(event)}
    >
      <div className="w-full flex flex-col items-center gap-6">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OtpBox
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.code?.message}
              phoneNumber={identifier.mobile ?? identifier.email}
              length={4}
            />
          )}
        />
        {phoneResendEnabled && resendAvailable ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={isPending || isResending}
            aria-busy={isResending}
            className="flex items-center gap-1 compact:text-xs fold:text-sm laptop:text-base font-peyda font-medium text-blue-500 self-center cursor-pointer disabled:cursor-wait"
          >
            {isResending && (
              <PiCircleNotch className="animate-spin" aria-hidden="true" />
            )}
            <span>ارسال مجدد کد امنیتی</span>
          </button>
        ) : (
          <Timer
            key={countdownKey}
            initialTime={120}
            onFinish={() => setResendAvailable(true)}
          />
        )}
      </div>
      <Button
        type="submit"
        classes="w-full mt-auto! btn btn-primary-green"
        title="تایید"
        disable={isPending || isResending}
        loading={isPending}
      />
    </form>
  );
};

const VerifyOtpForm = (props: AuthenticatedOtpProps | RecoveryOtpProps) =>
  props.mode === "recovery" ? (
    <RecoveryOtpForm {...props} />
  ) : (
    <AuthenticatedOtpForm {...props} />
  );

export default VerifyOtpForm;
