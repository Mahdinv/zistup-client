import Button from "../../../shared/base-components/button";
import OtpBox from "../../../shared/base-components/otp-box";
import Timer from "../../../shared/base-components/timer";

const VerifyOtpForm = ({ onLastStep }: { onLastStep: () => void }) => {
  return (
    <form className="w-full min-h-0 flex-1 flex flex-col items-start gap-4">
      <div className="w-full flex flex-col items-center gap-6">
        <OtpBox />
        <Timer initialTime={120} onFinish={() => {}} />
      </div>
      <Button
        classes="w-full mt-auto! btn btn-primary-green"
        title="تایید"
        onClick={onLastStep}
      />
    </form>
  );
};

export default VerifyOtpForm;
