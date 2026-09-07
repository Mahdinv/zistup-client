import { PiInfo } from "react-icons/pi";

interface PriorityHintProps {
  value: number;
}

const CircleProgress = ({ value }: PriorityHintProps) => {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="w-full shrink-0 flex items-center justify-between gap-2 rounded-2xl border border-dark bg-darker-blue-300 px-4 py-2">
      <PiInfo className="shrink-0 text-white compact:text-7xl fold:text-8xl laptop:text-[40px]" />

      <p className="flex-1 min-w-0 font-peyda compact:text-sm fold:text-base laptop:text-lg text-white font-bold">
        رتبه‌ها ثابتن؛ با کشیدن غذاها به بالا یا پایین، اولویت‌هاشون رو جابه‌جا
        کن
      </p>

      <div className="relative shrink-0 compact:size-18 mobile-lg:size-20 fold:size-24">
        <svg className="size-full -rotate-90" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#191b20"
            strokeWidth="18"
          />

          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#75d5f6"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="font-rokh compact:text-lg fold:text-xl laptop:text-2xl font-black leading-none text-blue-400">
            %{value}
          </div>
          <div className="mt-1 compact:text-xxs fold:text-xs laptop:text-sm font-bold text-white">
            هم سویی
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleProgress;
