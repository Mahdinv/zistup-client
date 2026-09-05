import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";

type ScoreBarProps = {
  type: "health" | "price" | "environment" | "available";
  Dmax: number;
  totalScore: number;
};

const ScoreBar = ({ type, Dmax, totalScore }: ScoreBarProps) => {
  const displayPercent = Number(((totalScore / Dmax) * 100).toFixed(0));
  const getStatus = (value: number) => {
    if (value < 20) {
      return {
        label: "بحرانی",
        color: "#7B1717",
      };
    }

    if (value < 40) {
      return {
        label: "نیاز به بهبود",
        color: "#B36116",
      };
    }

    if (value < 60) {
      return {
        label: "عادی",
        color: "#8A741A",
      };
    }

    if (value < 80) {
      return {
        label: "خوب",
        color: "#0F502C",
      };
    }

    return {
      label: "عالی",
      color: "#1A894C",
    };
  };

  const status = getStatus(displayPercent);

  return (
    <li className="w-full flex flex-row justify-start items-center gap-2">
      <div
        className={`${type === "health" ? "bg-[#FFB7BC]" : type === "price" ? "bg-[#FCECAD]" : type === "available" ? "bg-[#C8E0FF]" : "bg-[#AAFFC9]"} rounded-full compact:p-1 mobile:p-2`}
      >
        {type === "health" ? (
          <PiHeartbeat className="compact:text-lg fold:text-xl laptop:text-2xl" />
        ) : type === "price" ? (
          <PiCoins className="compact:text-lg fold:text-xl laptop:text-2xl" />
        ) : type === "available" ? (
          <PiAlarm className="compact:text-lg fold:text-xl laptop:text-2xl" />
        ) : (
          <PiPlant className="compact:text-lg fold:text-xl laptop:text-2xl" />
        )}
      </div>
      <label className="flex-2 text-white font-peyda compact:text-base fold:text-lg laptop:text-xl font-bold whitespace-nowrap">
        {type === "health"
          ? "سلامتی"
          : type === "price"
            ? "هزینه"
            : type === "available"
              ? "سهولت تهیه"
              : "محیط زیست"}
      </label>
      <div className="relative flex-5 bg-darker-blue-400 border border-dark rounded-full px-4 flex flex-row justify-between items-center">
        <div
          className="absolute inset-0 bg-red-500 w-2/12 h-full rounded-full transition-all duration-500 z-10"
          style={{
            width: `${Math.min(Math.max(displayPercent, 0), 100)}%`,
            backgroundColor: status.color,
          }}
        ></div>
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

export default ScoreBar;
