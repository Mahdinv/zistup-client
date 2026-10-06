import {
  Filler,
  RadialLinearScale,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";

import ChartJS from "@/shared/lib/chartjs-setup";
import { useDashboardTheme } from "@/features/dashboard/hooks/use-dashboard-theme.hook";

ChartJS.register(RadialLinearScale, Filler);

// Scores are percentages, clockwise from the top axis.
type RadarValues = [
  nutrition: number,
  cost: number,
  environment: number,
  preparation: number,
];

type RadarChartProps = {
  currentValues?: RadarValues;
  optimalValues?: RadarValues;
};

// The project's Tailwind blue-400 token (src/index.css).
const BLUE = "#75d5f6";
const DEFAULT_CURRENT: RadarValues = [41, 76, 67, 72];
const DEFAULT_OPTIMAL: RadarValues = [75, 90, 81, 68];

const categories = [
  {
    label: "ارزش غذایی",
    Icon: PiHeartbeat,
    background: "bg-[#FFB7BC]",
    position: "col-start-2 row-start-1",
    labelWidth: "w-full",
  },
  {
    label: "مدیریت هزینه",
    Icon: PiCoins,
    background: "bg-[#FCECAD]",
    position: "col-start-3 row-start-2",
    labelWidth: "max-w-[4em]",
  },
  {
    label: "محیط زیست",
    Icon: PiPlant,
    background: "bg-[#AAFFC9]",
    position: "col-start-2 row-start-3",
    labelWidth: "w-full",
  },
  {
    label: "سهولت تهیه",
    Icon: PiAlarm,
    background: "bg-[#C8E0FF]",
    position: "col-start-1 row-start-2",
    labelWidth: "max-w-[3.5em]",
  },
];

const RadarChart = ({
  currentValues = DEFAULT_CURRENT,
  optimalValues = DEFAULT_OPTIMAL,
}: RadarChartProps) => {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#416574" : "#70bdd8";

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    events: [],
    layout: { padding: 2 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        startAngle: 0,
        ticks: { display: false, stepSize: 20 },
        pointLabels: { display: false },

        grid: { circular: true, color: gridColor, lineWidth: 1 },
        angleLines: { color: gridColor, lineWidth: 1 },
      },
    },
  };

  const data: ChartData<"radar"> = {
    labels: categories.map(({ label }) => label),
    datasets: [
      {
        label: "الگوی کنونی",
        data: currentValues,
        borderColor: BLUE,
        backgroundColor: isDark
          ? "rgba(126, 187, 208, 0.22)"
          : "rgba(117, 213, 246, 0.14)",
        borderWidth: 1.5,
        fill: true,
        tension: 0,
        pointBackgroundColor: BLUE,
        pointBorderColor: isDark ? "#1b1a20" : "#eef8fb",
        pointBorderWidth: 1.5,
        pointRadius: ({ chart }) =>
          Math.max(2.5, Math.min(6, chart.width / 47)),
        order: 0,
      },
      {
        label: "توازن بهینه",
        data: optimalValues,
        borderColor: isDark ? "#fcfcfc" : "#000000",
        borderWidth: 1.5,
        borderDash: [4, 5],
        backgroundColor: "transparent",
        fill: false,
        tension: 0,
        pointRadius: 0,
        order: 1,
      },
    ],
  };

  return (
    <div
      dir="ltr"
      className="mx-auto grid w-full min-w-0 max-w-116 grid-cols-[18%_64%_18%] items-center gap-y-1 font-peyda fold:grid-cols-[19.5%_61%_19.5%] fold:gap-y-2"
    >
      <div className="relative col-start-2 row-start-2 aspect-square w-full min-h-0 min-w-0">
        <Radar
          className="absolute inset-0"
          data={data}
          options={options}
          role="img"
          aria-label={categories
            .map(
              ({ label }, index) =>
                `${label}: الگوی کنونی ${currentValues[index]}٪، توازن بهینه ${optimalValues[index]}٪`,
            )
            .join("؛ ")}
        />
      </div>
      {categories.map(({ label, Icon, background, position, labelWidth }) => (
        <div
          key={label}
          dir="rtl"
          className={`${position} flex min-w-0 flex-col items-center justify-center gap-1 text-center font-peyda text-xs font-bold compact:text-xs mobile:text-sm fold:text-base laptop:text-lg`}
        >
          <span
            className={`${background} flex size-7 shrink-0 items-center justify-center rounded-full text-black compact:size-7 mobile:size-8 fold:size-9 laptop:size-10`}
          >
            <Icon
              aria-hidden="true"
              className="compact:text-lg mobile:text-xl fold:text-2xl laptop:text-3xl"
            />
          </span>
          <span className={`${labelWidth} leading-[130%] dark:text-white`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default RadarChart;
