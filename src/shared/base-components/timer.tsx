import { memo, useEffect, useState } from "react";
import { formatTime } from "../lib/format-time";

type TimerProps = {
  initialTime: number | null;
  onFinish: () => void;
};

const Timer = memo(({ initialTime, onFinish }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime || 0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
    }
  }, [timeLeft, onFinish]);

  return (
    <>
      {timeLeft > 0 ? (
        <label className="flex items-center compact:gap-1 fold:gap-2 laptop:gap-3.5 compact:text-xs fold:text-sm laptop:text-base font-peyda font-medium text-blue-500 self-center">
          <span className="w-6">{formatTime(timeLeft)}</span>
          <span>تا ارسال مجدد</span>
        </label>
      ) : null}
    </>
  );
});

export default Timer;
