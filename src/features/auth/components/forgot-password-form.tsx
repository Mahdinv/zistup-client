import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import TextBox from "@/shared/base-components/text-box";
import Button from "@/shared/base-components/button";
import { RegistrationUsernameSchema } from "../schemas/register.schema";
import { forgotPassword } from "../api/auth.api";
import useRecoveryMutation from "../hooks/use-recovery-mutation.hook";
import type { ForgotPasswordResult } from "../api/auth.types";

const schema = z.object({ username: RegistrationUsernameSchema });

const ForgotPasswordForm = ({
  username,
  onChange,
  onSuccess,
}: {
  username: string;
  onChange: (username: string) => void;
  onSuccess: (result: ForgotPasswordResult, username: string) => void;
}) => {
  const { submit, isPending } = useRecoveryMutation(
    forgotPassword,
    (result, input) => onSuccess(result, input.username),
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  return (
    <form
      noValidate
      className="auth-form flex h-full min-h-0 flex-col"
      onSubmit={(event) => void handleSubmit(submit)(event)}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-10 pb-6">
        <TextBox
          label="نام کاربری رو وارد کن"
          placeHolder="نام کاربری خودت انگلیسی وارد کن"
          classes="login-text-box"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          {...register("username", {
            onChange: (event) => onChange(event.target.value),
          })}
          error={errors.username?.message}
          aria-invalid={!!errors.username}
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
export default ForgotPasswordForm;
