import { memo } from "react";
import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";

type ScoreBarProps = {
  type: "health" | "price" | "environment" | "available";
  percent: number;
};

const configs = {
  health: {
    label: "سلامتی",
    icon: PiHeartbeat,
    background: "bg-[#FFB7BC]",
  },
  price: {
    label: "هزینه",
    icon: PiCoins,
    background: "bg-[#FCECAD]",
  },
  available: {
    label: "سهولت تهیه",
    icon: PiAlarm,
    background: "bg-[#C8E0FF]",
  },
  environment: {
    label: "محیط زیست",
    icon: PiPlant,
    background: "bg-[#AAFFC9]",
  },
} as const;

const getStatus = (value: number) => {
  if (value < 20)
    return {
      label: "بحرانی",
      color: "#7B1717",
    };

  if (value < 40)
    return {
      label: "نیاز به بهبود",
      color: "#B36116",
    };

  if (value < 60)
    return {
      label: "عادی",
      color: "#8A741A",
    };

  if (value < 80)
    return {
      label: "خوب",
      color: "#0F502C",
    };

  return {
    label: "عالی",
    color: "#1A894C",
  };
};

const ScoreBar = ({ type, percent }: ScoreBarProps) => {
  const displayPercent = Math.round(Math.min(Math.max(percent, 0), 100));

  const config = configs[type];
  const status = getStatus(displayPercent);
  const Icon = config.icon;

  return (
    <li className="w-full flex flex-row justify-start items-center gap-2">
      <div
        className={`${config.background} rounded-full compact:p-1 mobile:p-2`}
      >
        <Icon className="compact:text-lg fold:text-xl laptop:text-2xl" />
      </div>

      <label className="flex-2 text-white font-peyda compact:text-base fold:text-lg laptop:text-xl font-bold whitespace-nowrap">
        {config.label}
      </label>

      <div className="relative flex-5 bg-darker-blue-400 border border-dark rounded-full px-4 flex flex-row justify-between items-center overflow-hidden">
        <div
          className="absolute inset-y-0 inset-s-0 h-full rounded-full transition-all duration-500 z-10"
          style={{
            width: `${displayPercent}%`,
            backgroundColor: status.color,
          }}
        />

        <span className="compact:text-lg fold:text-xl laptop:text-2xl font-rokh text-white mt-1 z-20">
          {displayPercent}
        </span>

        <label className="compact:text-sm fold:text-base laptop:text-lg font-peyda font-bold text-white z-20">
          {status.label}
        </label>
      </div>
    </li>
  );
};

export default memo(ScoreBar);
