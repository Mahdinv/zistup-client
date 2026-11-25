import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import Button from "@/shared/base-components/button";
import OtpBox from "@/shared/base-components/otp-box";
import Timer from "@/shared/base-components/timer";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Otp, OtpSchema } from "../schemas/login.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { normalizeApiError, tokenStorage } from "../../../shared/api";
import { useNavigate } from "react-router-dom";
import type { AuthIdentifierDTO } from "../api/auth.types";
import { validateUser } from "../api/auth.api";
import { getPostAuthPath } from "../loaders/get-post-auth-path";
import { useRef } from "react";

const VerifyOtpForm = ({
  identifier,
  refCode,
  onVerify = validateUser,
  successPath,
}: {
  identifier: AuthIdentifierDTO;
  refCode?: string;
  onVerify?: (data: Otp) => ReturnType<typeof validateUser>;
  successPath?: string;
}) => {
  const navigate = useNavigate();
  const inFlight = useRef(false);
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
        <Timer initialTime={120} onFinish={() => {}} />
      </div>
      <Button
        type="submit"
        classes="w-full mt-auto! btn btn-primary-green"
        title="تایید"
        disable={isPending}
        loading={isPending}
      />
    </form>
  );
};

export default VerifyOtpForm;
