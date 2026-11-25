import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { toast } from "sonner";
import Button from "@/shared/base-components/button";
import TextBox from "@/shared/base-components/text-box";
import {
  UsernameLoginSchema,
  type UsernameLogin,
} from "../schemas/login.schema";

type UsernameLoginFormProps = {
  onPhoneLogin: () => void;
};

const UsernameLoginForm = ({ onPhoneLogin }: UsernameLoginFormProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsernameLogin>({
    resolver: zodResolver(UsernameLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit: SubmitHandler<UsernameLogin> = () => {
    // No username authentication service is available yet; never use the OTP API here.
    toast.info(
      "ورود با نام کاربری هنوز فعال نشده است. لطفاً با شماره موبایل وارد شوید.",
    );
  };

  return (
    <form
      noValidate
      className="flex flex-1 flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextBox
        label="نام کاربری"
        placeHolder="نام کاربری خودت اینجا وارد کن"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        classes="login-text-box"
        {...register("username")}
        error={errors.username?.message}
        aria-invalid={!!errors.username}
      />
      <TextBox
        label="رمز عبور"
        type={passwordVisible ? "text" : "password"}
        placeHolder="رمز عبورت رو اینجا وارد کن"
        autoComplete="current-password"
        classes="login-text-box"
        {...register("password")}
        error={errors.password?.message}
        aria-invalid={!!errors.password}
        icon={
          <button
            type="button"
            aria-label={
              passwordVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"
            }
            aria-pressed={passwordVisible}
            aria-controls="password"
            className="flex size-6 cursor-pointer items-center justify-center rounded-sm text-4xl text-blue-900"
            onClick={() => setPasswordVisible((visible) => !visible)}
          >
            {passwordVisible ? (
              <PiEyeClosedBold aria-hidden="true" />
            ) : (
              <PiEyeBold aria-hidden="true" />
            )}
          </button>
        }
      />
      <a
        href="#mobile-login-panel"
        className="self-center text-base font-bold text-blue-600 underline underline-offset-4"
        onClick={(event) => {
          event.preventDefault();
          onPhoneLogin();
        }}
      >
        فراموشی رمز عبور
      </a>

      <div className="mt-auto flex shrink-0 flex-col gap-3 pt-6">
        <Button
          type="submit"
          classes="btn btn-primary-green login-action"
          title="ورود"
        />
        <Button
          classes="btn btn-outline-green login-action"
          title="ساخت حساب جدید"
          onClick={onPhoneLogin}
        />
      </div>
    </form>
  );
};

export default UsernameLoginForm;
