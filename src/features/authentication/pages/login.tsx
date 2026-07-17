import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MainContainer from "../components/main-container";
import { useOutletContext } from "react-router-dom";
import type { AuthOutletContext } from "../../../layouts/auth-layout";
import LoginForm from "../components/login-form";
import VerifyOtpForm from "../components/verify-otp-form";

const Login = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (step === 2) {
      setBackHandler(() => {
        setStep(1);
      });
    }

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  return (
    <MainContainer isFirstStep={step === 1} isLastStep={step === 2}>
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <LoginForm key="step-1" onNextStep={() => setStep(2)} />
        ) : (
          <VerifyOtpForm key="step-2" onLastStep={() => setStep(1)} />
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default Login;
