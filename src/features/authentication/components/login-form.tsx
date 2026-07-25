import { FaCaretDown } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
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
    <motion.form
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex-1 compact:px-4 mobile-lg:px-6 py-7 h-full flex flex-col justify-start items-start gap-7 will-change-[transform,opacity]"
      onSubmit={handleSubmit(onLoginFormHandler)}
    >
      <TextBox
        label="شماره موبایل یا ایمیل"
        subLabel="برای ورود، شماره تماست رو وارد کن"
        placeHolder="مثال: 09333593301"
        {...register("mobile")}
        error={errors.mobile?.message}
      />
      <div className="w-full h-auto flex flex-col items-center justify-start gap-4">
        <div
          className="flex w-full flex-row justify-start items-center gap-1 cursor-pointer select-none"
          onClick={() => setInviteCode((prev) => !prev)}
        >
          <label className="font-yekan text-base font-extrabold text-white underline cursor-pointer">
            کد دعوت داری؟
          </label>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: inviteCode ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <FaCaretDown className="self-start text-white text-xl" />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {inviteCode && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
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
      <div className="w-full h-full flex flex-col gap-2 justify-end text-white">
        <Button
          type="submit"
          classes="w-full btn btn-primary-green"
          title="دریافت کد"
        />
        <Button
          classes="btn btn-outline"
          title="ورود با حساب گوگل"
          icon={<FcGoogle />}
          iconClasses="text-4xl"
          itemsGap={10}
        />
      </div>
    </motion.form>
  );
};

export default LoginForm;
