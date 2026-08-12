import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MainContainer from "../components/main-container";
import LoginForm from "../components/login-form";
import VerifyOtpForm from "../components/verify-otp-form";
import type { AuthOutletContext } from "../../../layouts/auth-layout";
import type { AuthIdentifierDTO } from "../models/send-code.types";

type AuthFlow =
  | {
      step: 1;
    }
  | {
      step: 2;
      identifier: AuthIdentifierDTO;
      refCode?: string;
    };

const Login = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();

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
    <MainContainer
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
    </MainContainer>
  );
};

export default Login;
