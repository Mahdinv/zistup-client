import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { normalizeApiError, tokenStorage } from "@/shared/api";
import { initializeSession } from "@/app/initialize-session";
import { loginWithPassword, logout } from "../api/auth.api";
import Button from "@/shared/base-components/button";
import TextBox from "@/shared/base-components/text-box";
import PasswordTextBox from "./password-text-box";
import {
  UsernameLoginSchema,
  type UsernameLogin,
} from "../schemas/login.schema";

type UsernameLoginFormProps = {
  onForgotPassword: (values: UsernameLogin) => void;
  defaultValues?: UsernameLogin;
  onRegister: () => void;
};

const UsernameLoginForm = ({
  onForgotPassword,
  defaultValues,
  onRegister,
}: UsernameLoginFormProps) => {
  const navigate = useNavigate();
  const inFlight = useRef(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async (credentials: UsernameLogin) => {
      const data = await loginWithPassword(credentials);
      logout();
      tokenStorage.set(data.token);
      try {
        await initializeSession();
      } catch (error) {
        logout();
        throw error;
      }
    },
    gcTime: 0,
    onSuccess: () => {
      toast.success("خوش آمدید");
      navigate("/app/dashboard");
    },
    onError: (error) => {
      inFlight.current = false;
      toast.error(normalizeApiError(error).message);
    },
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<UsernameLogin>({
    resolver: zodResolver(UsernameLoginSchema),
    defaultValues: defaultValues ?? { username: "", password: "" },
  });

  const onSubmit: SubmitHandler<UsernameLogin> = (data) => {
    if (inFlight.current) return;
    inFlight.current = true;
    mutate(data);
  };

  return (
    <form
      noValidate
      className="flex flex-1 flex-col gap-4"
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
    >
      <TextBox
        label="نام کاربری"
        placeHolder="نام کاربری خودت اینجا وارد کن"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        classes="login-text-box"
        {...register("username")}
        error={errors.username?.message}
        aria-invalid={!!errors.username}
        disabled={isPending}
      />
      <PasswordTextBox
        label="رمز عبور"
        placeHolder="رمز عبورت رو اینجا وارد کن"
        autoComplete="current-password"
        classes="login-text-box"
        {...register("password")}
        error={errors.password?.message}
        aria-invalid={!!errors.password}
        disabled={isPending}
      />
      <a
        href="#forgot-password"
        className="self-center text-base font-bold text-blue-600 underline underline-offset-4"
        aria-disabled={isPending}
        onClick={(event) => {
          event.preventDefault();
          if (!isPending) onForgotPassword(getValues());
        }}
      >
        فراموشی رمز عبور
      </a>

      <div className="mt-auto flex shrink-0 flex-col gap-3 pt-6">
        <Button
          type="submit"
          classes="btn btn-primary-green login-action"
          title="ورود"
          loading={isPending}
          disable={isPending}
        />
        <Button
          classes="btn btn-outline-green login-action"
          title="ساخت حساب جدید"
          onClick={onRegister}
          disable={isPending}
        />
      </div>
    </form>
  );
};

export default UsernameLoginForm;
