import Button from "@/shared/base-components/button";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type GameCompletedModalProps = {
  step: number;
  nextGameLink: string;
  open: boolean;
};

const GameCompletedModal = ({
  step,
  nextGameLink,
  open = false,
}: GameCompletedModalProps) => {
  const navigate = useNavigate();
  const stepTitles = [
    "اول",
    "دوم",
    "سوم",
    "چهارم",
    "پنجم",
    "ششم",
    "هفتم",
    "هشتم",
  ];
  const percent = (step * 100) / 8;
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="absolute inset-0 grid place-items-center z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bg-black/80 inset-0 z-9998"
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="compact:w-4/5 mobile-lg:w-2/3 fold:w-3/5 tablet:w-2/3 laptop:w-9/12 text-white bg-darker-blue-200 border-2 border-dark rounded-3xl px-4 py-4.5 z-9999 flex flex-col justify-cneter items-center gap-6"
          >
            <div className="relative compact:w-24 compact:h-24 mobile-lg:w-32 mobile-lg:h-32 fold:w-36 fold:h-36 laptop:w-44 laptop:h-44 flex items-center justify-center">
              <svg
                className="compact:w-24 compact:h-24 mobile-lg:w-32 mobile-lg:h-32 fold:w-36 fold:h-36 laptop:w-44 laptop:h-44"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#314951"
                  strokeWidth={strokeWidth}
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#00a63e"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                />
              </svg>
              <span className="text-green-400 absolute compact:text-5xl fold:text-7xl laptop:text-8xl font-extrabold font-rokh mt-1.5">
                {step}/8
              </span>
            </div>
            <div className="compact:text-xl fold:text-2xl laptop:text-3xl font-peyda font-bold text-center">
              مرحله {stepTitles[step - 1]} تکمیل شد!
            </div>
            <div className="w-full flex flex-col items-center gap-3">
              <Button
                classes="btn btn-primary-green compact:text-base! fold:text-lg! laptop:text-xl! rounded-lg!"
                title={`شروع مرحله ${stepTitles[step]}`}
                onClick={() => navigate(nextGameLink)}
              />
              <Button
                classes="btn btn-link compact:text-sm! fold:text-base! laptop:text-lg!"
                title="مشاهده نقشه راه"
                onClick={() => navigate("/game-workflow")}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GameCompletedModal;
