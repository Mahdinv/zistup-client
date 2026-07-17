import { easeInOut, motion } from "framer-motion";
import Button from "../../../shared/base-components/button";
import OtpBox from "../../../shared/base-components/otp-box";
import Timer from "../../../shared/base-components/timer";

const VerifyOtpForm = ({ onLastStep }: { onLastStep: () => void }) => {
  return (
    <motion.div
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -24, opacity: 0 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex-1 compact:px-4 mobile-lg:px-6 h-full flex flex-col justify-between items-start gap-7 will-change-[transform,opacity]"
    >
      <div className="w-full flex flex-col items-center gap-6">
        <OtpBox />
        <Timer initialTime={120} onFinish={() => {}} />
      </div>
      <Button
        classes="w-full btn btn-primary"
        title="تایید"
        onClick={onLastStep}
      />
    </motion.div>
  );
};

export default VerifyOtpForm;
