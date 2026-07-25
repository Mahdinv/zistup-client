import { FaCaretDown } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, motion } from "framer-motion";
import TextBox from "../../../shared/base-components/text-box";
import { useState } from "react";
import Button from "../../../shared/base-components/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type Login } from "../schemas/login.schema";

const LoginForm = ({ onNextStep }: { onNextStep: () => void }) => {
  const [inviteCode, setInviteCode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
  });

  const onLoginFormHandler: SubmitHandler<Login> = (data) => {
    console.log(data);
    onNextStep();
  };

  return (
    <form
      className="flex w-full min-h-0 flex-1 flex-col items-start gap-4"
      onSubmit={handleSubmit(onLoginFormHandler)}
    >
      <TextBox
        label="شماره موبایل یا ایمیل"
        subLabel="برای ورود، شماره تماست رو وارد کن"
        placeHolder="مثال: 09333593301"
        {...register("mobile")}
        error={errors.mobile?.message}
      />

      <div className="flex w-full shrink-0 flex-col items-center gap-4">
        <button
          type="button"
          className="flex w-full cursor-pointer select-none items-center justify-start gap-1"
          onClick={() => setInviteCode((prev) => !prev)}
        >
          <span className="font-yekan text-base font-extrabold text-white underline">
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
            <FaCaretDown className="text-xl text-white" />
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
                placeHolder="مثال: 45Hgw88is"
                {...register("invitationCode")}
                error={errors.invitationCode?.message}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex w-full shrink-0 flex-col gap-2 pt-4 text-white">
        <Button
          type="submit"
          classes="w-full btn btn-primary-green"
          title="دریافت کد"
        />

        <Button
          type="button"
          classes="w-full btn btn-outline"
          title="ورود با حساب گوگل"
          icon={<FcGoogle />}
          iconClasses="text-4xl"
          itemsGap={10}
        />
      </div>
    </form>
  );
};

export default LoginForm;
