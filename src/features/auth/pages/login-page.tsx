import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginMethodTabs, {
  type LoginMethod,
} from "../components/login-method-tabs";
import UsernameRegisterForm from "../components/username-register-form";
import UsernameRegisterOtpForm from "../components/username-register-otp-form";
import type { UsernameRegister } from "../schemas/register.schema";
import "../components/auth-forms.css";
import VerifyOtpForm from "../components/verify-otp-form";
import type { AuthIdentifierDTO } from "../api/auth.types";
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
    };

const LoginPage = () => {
  const { setBackHandler, setHeader } =
    useOutletContext<AccountFlowOutletContext>();

  const [authFlow, setAuthFlow] = useState<AuthFlow>({
    step: 1,
  });

  useEffect(() => {
    if (authFlow.step === 3) {
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
          method: authFlow.screen === "register" ? "username" : "mobile",
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
      isRegistering
        ? {
            variant: "login",
            firstLineTitle: "ساخت",
            secondLineTitle: "حساب کاربری",
          }
        : null,
    );
    return () => setHeader(null);
  }, [isRegistering, setHeader]);

  return (
    <AccountFlowContainer
      stepKey={authFlow.step}
      isFirstStep={authFlow.step === 1}
      isLastStep={authFlow.step !== 1}
      scrollMode={isRegistering ? "child" : "container"}
      contentClassName={
        isRegistering
          ? "p-0"
          : authFlow.step === 1
            ? "px-4 pt-10 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            : undefined
      }
    >
      {authFlow.step === 1 ? (
        <LoginMethodTabs
          defaultMethod={authFlow.method}
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
        />
      )}
    </AccountFlowContainer>
  );
};

export default LoginPage;
