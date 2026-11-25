import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Button from "@/shared/base-components/button";
import TextBox from "@/shared/base-components/text-box";
import PasswordTextBox from "./password-text-box";
import {
  UsernameLoginSchema,
  type UsernameLogin,
} from "../schemas/login.schema";

type UsernameLoginFormProps = {
  onPhoneLogin: () => void;
  onRegister: () => void;
};

const UsernameLoginForm = ({
  onPhoneLogin,
  onRegister,
}: UsernameLoginFormProps) => {
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
      <PasswordTextBox
        label="رمز عبور"
        placeHolder="رمز عبورت رو اینجا وارد کن"
        autoComplete="current-password"
        classes="login-text-box"
        {...register("password")}
        error={errors.password?.message}
        aria-invalid={!!errors.password}
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
          onClick={onRegister}
        />
      </div>
    </form>
  );
};

export default UsernameLoginForm;
