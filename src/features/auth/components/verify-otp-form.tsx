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

const VerifyOtpForm = ({
  identifier,
  refCode,
}: {
  identifier: AuthIdentifierDTO;
  refCode?: string;
}) => {
  const navigate = useNavigate();
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
    mutationFn: validateUser,
    onSuccess: (data) => {
      toast.success("خوش آمدید");
      tokenStorage.set(data.token);
      // if (!data.isRegister) {
      //   if (data.user.name === "کاربر جدید" || data.user.sex === null) {
      //     navigate("/onboarding/basic-information");
      //   } else {
      //     navigate("/onboarding/choose-plan");
      //   }
      // } else {
      //   console.log("Dashboard");
      // }
      if (
        (!data.isRegister && data.user.name === "کاربر جدید") ||
        data.user.sex === null
      ) {
        navigate("/onboarding/basic-information");
      } else {
        navigate("/onboarding/choose-plan");
      }
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const onVerifyOtpHandler: SubmitHandler<Otp> = (data) => {
    mutate(data);
  };

  return (
    <form
      className="w-full min-h-0 flex-1 flex flex-col items-start gap-4"
      onSubmit={handleSubmit(onVerifyOtpHandler)}
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
      />
    </form>
  );
};

export default VerifyOtpForm;
