import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import MainContainer from "../components/main-container";
import LoginForm from "../components/login-form";
import VerifyOtpForm from "../components/verify-otp-form";

import type { AuthOutletContext } from "../../../layouts/auth-layout";

const Login = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();

  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (step === 2) {
      setBackHandler(() => {
        setStep(1);
      });
    } else {
      setBackHandler(null);
    }

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  return (
    <MainContainer
      stepKey={step}
      isFirstStep={step === 1}
      isLastStep={step === 2}
      scrollMode="container"
    >
      {step === 1 ? (
        <LoginForm onNextStep={() => setStep(2)} />
      ) : (
        <VerifyOtpForm onLastStep={() => setStep(1)} />
      )}
    </MainContainer>
  );
};

export default Login;
