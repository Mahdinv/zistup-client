import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import LoginForm from "../components/login-form";
import VerifyOtpForm from "../components/verify-otp-form";
import type { AuthIdentifierDTO } from "../api/auth.types";
import type { AccountFlowOutletContext } from "@/app/layouts/account-flow/account-flow.types";
import AccountFlowContainer from "@/app/layouts/account-flow/account-flow-container";

type AuthFlow =
  | {
      step: 1;
    }
  | {
      step: 2;
      identifier: AuthIdentifierDTO;
      refCode?: string;
    };

const LoginPage = () => {
  const { setBackHandler } = useOutletContext<AccountFlowOutletContext>();

  const [authFlow, setAuthFlow] = useState<AuthFlow>({
    step: 1,
  });

  useEffect(() => {
    if (authFlow.step === 2) {
      setBackHandler(() => {
        setAuthFlow({ step: 1 });
      });
    } else {
      setBackHandler(null);
    }

    return () => {
      setBackHandler(null);
    };
  }, [authFlow.step, setBackHandler]);

  return (
    <AccountFlowContainer
      stepKey={authFlow.step}
      isFirstStep={authFlow.step === 1}
      isLastStep={authFlow.step === 2}
      scrollMode="container"
    >
      {authFlow.step === 1 ? (
        <LoginForm
          onSuccess={(identifier, refCode) => {
            setAuthFlow({
              step: 2,
              identifier,
              refCode,
            });
          }}
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
