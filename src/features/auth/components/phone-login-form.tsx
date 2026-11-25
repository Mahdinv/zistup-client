import { FaCaretDown } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import TextBox from "@/shared/base-components/text-box";
import { useEffect, useRef, useState } from "react";
import Button from "@/shared/base-components/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneLoginSchema, type PhoneLogin } from "../schemas/login.schema";
import { useMutation } from "@tanstack/react-query";
import { normalizeApiError } from "../../../shared/api";
import { toast } from "sonner";
import type { AuthIdentifierDTO } from "../api/auth.types";
import { getGoogleLoginUrl, sendCode } from "../api/auth.api";
import { mapLoginFormToIdentifierDto } from "../api/auth.mapper";

const PhoneLoginForm = ({
  onSuccess,
}: {
  onSuccess: (identifier: AuthIdentifierDTO, refCode?: string) => void;
}) => {
  const [inviteCode, setInviteCode] = useState(false);
  const loginInFlight = useRef(false);
  const [googlePending, setGooglePending] = useState(false);
  useEffect(() => {
    const reset = () => {
      loginInFlight.current = false;
      setGooglePending(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const { mutate: requestGoogleLogin } = useMutation({
    mutationFn: getGoogleLoginUrl,
    onSuccess: (url) => {
      window.location.assign(url);
    },
    onError: (error) => {
      loginInFlight.current = false;
      setGooglePending(false);
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const googleLogin = () => {
    if (loginInFlight.current) return;
    loginInFlight.current = true;
    // Keep the redirect locked until navigation or a browser back/forward restore.
    setGooglePending(true);
    requestGoogleLogin();
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneLogin>({
    resolver: zodResolver(PhoneLoginSchema),
    defaultValues: { identifier: "", invitationCode: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      identifier,
    }: {
      identifier: AuthIdentifierDTO;
      refCode?: string;
    }) => {
      return sendCode(identifier);
    },
    onSuccess: (_, variables) => {
      toast.success("کد امنیتی برای شما ارسال شد");
      onSuccess(variables.identifier, variables.refCode);
    },
    onError: (error) => {
      loginInFlight.current = false;
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const onLoginFormHandler: SubmitHandler<PhoneLogin> = (data) => {
    if (loginInFlight.current) return;
    loginInFlight.current = true;
    const identifier = mapLoginFormToIdentifierDto(data.identifier);
    mutate({
      identifier,
      refCode: data.invitationCode?.trim() || undefined,
    });
  };

  return (
    <form
      noValidate
      className="flex w-full min-h-0 flex-1 flex-col items-start gap-4"
      onSubmit={(event) => void handleSubmit(onLoginFormHandler)(event)}
    >
      <TextBox
        classes="login-text-box"
        label="برای ورود شماره تماست رو وارد کن"
        type="text"
        inputMode="text"
        placeHolder="مثال: 09123456789"
        localizePhoneNumber
        {...register("identifier")}
        error={errors.identifier?.message}
        aria-invalid={!!errors.identifier}
      />

      <div className="flex w-full shrink-0 flex-col items-center gap-4">
        <button
          type="button"
          className="flex w-full cursor-pointer select-none items-center justify-start gap-1"
          onClick={() => setInviteCode((prev) => !prev)}
        >
          <span className="font-yekan compact:text-base fold:text-lg laptop:text-xl font-extrabold text-white underline">
            کد دعوت داری؟
          </span>

          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: inviteCode ? 180 : 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <FaCaretDown className="compact:text-xl fold:text-2xl laptop:text-3xl text-white" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {inviteCode && (
            <motion.div
              key="invite-code"
              initial={{
                y: -20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="w-full shrink-0"
            >
              <TextBox
                classes="login-text-box"
                placeHolder="مثال: 45Hgw88is"
                {...register("invitationCode")}
                error={errors.invitationCode?.message}
                aria-invalid={!!errors.invitationCode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-3 pt-4 text-white">
        <Button
          type="submit"
          classes="w-full btn btn-primary-green login-action"
          title="دریافت کد"
          disable={isPending || googlePending}
          loading={isPending}
        />

        <Button
          type="button"
          classes="w-full btn btn-outline-green login-action"
          title={
            googlePending ? "در حال اتصال به گوگل..." : "ورود با حساب گوگل"
          }
          disable={isPending || googlePending}
          loading={googlePending}
          onClick={googleLogin}
          icon={<FcGoogle />}
          iconClasses="text-4xl"
          itemsGap={10}
        />
      </div>
    </form>
  );
};

export default PhoneLoginForm;
