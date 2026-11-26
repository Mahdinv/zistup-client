import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import LoginMethodTabs, {
  type LoginMethod,
} from "../components/login-method-tabs";
import UsernameRegisterForm from "../components/username-register-form";
import UsernameRegisterOtpForm from "../components/username-register-otp-form";
import type {
  UsernameRegister,
  ResetPassword,
} from "../schemas/register.schema";
import type { UsernameLogin } from "../schemas/login.schema";
import ForgotPasswordForm from "../components/forgot-password-form";
import ResetPasswordForm from "../components/reset-password-form";
import "../components/auth-forms.css";
import VerifyOtpForm from "../components/verify-otp-form";
import type { AuthIdentifierDTO, PasswordResetGrant } from "../api/auth.types";
import type { AccountFlowOutletContext } from "@/app/layouts/account-flow/account-flow.types";
import AccountFlowContainer from "@/app/layouts/account-flow/account-flow-container";

type AuthFlow =
  | {
      step: 1;
      method?: LoginMethod;
    }
  | {
      step: 2;
      screen: "otp";
      identifier: AuthIdentifierDTO;
      refCode?: string;
    }
  | {
      step: 2;
      screen: "register";
      values?: UsernameRegister;
    }
  | {
      step: 3;
      screen: "registration-otp";
      registration: UsernameRegister;
    }
  | { step: 2; screen: "forgot" }
  | { step: 3; screen: "recovery-otp" }
  | { step: 4; screen: "reset"; grant: PasswordResetGrant };

const LoginPage = () => {
  const navigate = useNavigate();
  const { setBackHandler, setHeader } =
    useOutletContext<AccountFlowOutletContext>();

  const [authFlow, setAuthFlow] = useState<AuthFlow>({
    step: 1,
  });
  const [loginDraft, setLoginDraft] = useState<UsernameLogin | undefined>();
  const [recoveryUsername, setRecoveryUsername] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryMobile, setRecoveryMobile] = useState("");
  const [resetDraft, setResetDraft] = useState<ResetPassword>({
    password: "",
    confirmPassword: "",
  });
  const isRecovery =
    authFlow.step !== 1 &&
    ["forgot", "recovery-otp", "reset"].includes(authFlow.screen);

  useEffect(() => {
    if (authFlow.step === 4) {
      setBackHandler(() => {
        setResetDraft({ password: "", confirmPassword: "" });
        setRecoveryCode("");
        setAuthFlow({ step: 3, screen: "recovery-otp" });
      });
    } else if (authFlow.step === 3 && authFlow.screen === "recovery-otp") {
      setBackHandler(() => setAuthFlow({ step: 2, screen: "forgot" }));
    } else if (authFlow.step === 3) {
      setBackHandler(() => {
        setAuthFlow({
          step: 2,
          screen: "register",
          values: authFlow.registration,
        });
      });
    } else if (authFlow.step === 2) {
      setBackHandler(() => {
        setAuthFlow({
          step: 1,
          method: authFlow.screen === "otp" ? "mobile" : "username",
        });
      });
    } else {
      setBackHandler(null);
    }

    return () => {
      setBackHandler(null);
    };
  }, [authFlow, setBackHandler]);

  const isRegistering = authFlow.step === 2 && authFlow.screen === "register";
  useEffect(() => {
    setHeader(
      isRecovery
        ? {
            variant: "login",
            firstLineTitle: "فراموشی",
            secondLineTitle: "رمز عبور",
          }
        : isRegistering
          ? {
              variant: "login",
              firstLineTitle: "ساخت",
              secondLineTitle: "حساب کاربری",
            }
          : null,
    );
    return () => setHeader(null);
  }, [isRegistering, isRecovery, setHeader]);

  return (
    <AccountFlowContainer
      stepKey={authFlow.step}
      isFirstStep={authFlow.step === 1}
      isLastStep={authFlow.step !== 1}
      scrollMode={isRegistering || isRecovery ? "child" : "container"}
      contentClassName={
        isRegistering || isRecovery
          ? "p-0"
          : authFlow.step === 1
            ? "px-4 pt-10 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            : undefined
      }
    >
      {authFlow.step === 1 ? (
        <LoginMethodTabs
          defaultMethod={authFlow.method}
          usernameDefaultValues={loginDraft}
          onForgotPassword={(values) => {
            setLoginDraft(values);
            setRecoveryUsername(values.username || recoveryUsername);
            setRecoveryCode("");
            setRecoveryMobile("");
            setResetDraft({ password: "", confirmPassword: "" });
            setAuthFlow({ step: 2, screen: "forgot" });
          }}
          onRegister={() => setAuthFlow({ step: 2, screen: "register" })}
          onSuccess={(identifier, refCode) => {
            setAuthFlow({
              step: 2,
              screen: "otp",
              identifier,
              refCode,
            });
          }}
        />
      ) : authFlow.screen === "forgot" ? (
        <ForgotPasswordForm
          username={recoveryUsername}
          onChange={(username) => {
            setRecoveryUsername(username);
            setRecoveryCode("");
            setRecoveryMobile("");
            setResetDraft({ password: "", confirmPassword: "" });
          }}
          onSuccess={(result, username) => {
            setRecoveryUsername(username);
            setRecoveryMobile(result.mobile);
            setRecoveryCode("");
            setResetDraft({ password: "", confirmPassword: "" });
            toast.success(result.message);
            setAuthFlow({ step: 3, screen: "recovery-otp" });
          }}
        />
      ) : authFlow.screen === "recovery-otp" ? (
        <VerifyOtpForm
          mode="recovery"
          username={recoveryUsername}
          mobile={recoveryMobile}
          code={recoveryCode}
          onCodeChange={setRecoveryCode}
          onVerified={(grant) =>
            setAuthFlow({ step: 4, screen: "reset", grant })
          }
        />
      ) : authFlow.screen === "reset" ? (
        <ResetPasswordForm
          values={resetDraft}
          grant={authFlow.grant}
          onExpired={() => {
            setResetDraft({ password: "", confirmPassword: "" });
            setRecoveryCode("");
            toast.error(
              "مهلت تغییر رمز عبور تمام شده است. دوباره کد تأیید را وارد کنید.",
            );
            setAuthFlow({ step: 3, screen: "recovery-otp" });
          }}
          onSuccess={(result) => {
            setLoginDraft({ username: recoveryUsername, password: "" });
            setRecoveryUsername("");
            setRecoveryMobile("");
            setRecoveryCode("");
            setResetDraft({ password: "", confirmPassword: "" });
            setAuthFlow({ step: 1, method: "username" });
            toast.success(result.message);
            navigate("/auth/login", { replace: true });
          }}
          onChange={(values) =>
            setResetDraft((previous) => ({ ...previous, ...values }))
          }
        />
      ) : authFlow.step === 3 ? (
        <UsernameRegisterOtpForm registration={authFlow.registration} />
      ) : authFlow.screen === "register" ? (
        <UsernameRegisterForm
          defaultValues={authFlow.values}
          onSuccess={(registration) =>
            setAuthFlow({ step: 3, screen: "registration-otp", registration })
          }
        />
      ) : (
        <VerifyOtpForm
          identifier={authFlow.identifier}
          refCode={authFlow.refCode}
          allowPhoneResend
        />
      )}
    </AccountFlowContainer>
  );
};

export default LoginPage;
