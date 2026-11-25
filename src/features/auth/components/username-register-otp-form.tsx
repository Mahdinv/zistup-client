import VerifyOtpForm from "./verify-otp-form";
import { validateUser } from "../api/auth.api";
import type { UsernameRegister } from "../schemas/register.schema";

const UsernameRegisterOtpForm = ({
  registration,
}: {
  registration: UsernameRegister;
}) => (
  <VerifyOtpForm
    identifier={{ mobile: registration.mobile }}
    successPath="/onboarding/basic-information"
    onVerify={({ code }) =>
      validateUser({
        mobile: registration.mobile,
        code,
        username: registration.username,
        password: registration.password,
        version: "1.0",
        versionCode: 101,
      })
    }
  />
);

export default UsernameRegisterOtpForm;
