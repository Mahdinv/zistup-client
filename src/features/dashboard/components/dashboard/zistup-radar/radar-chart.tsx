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
import type { RadarData } from "../../../api/types/radar.types";
import { getRadarDisplayAxes } from "../../../lib/radar.utils";

ChartJS.register(RadialLinearScale, Filler);

type RadarChartProps = {
  radar?: RadarData;
};

// The project's Tailwind blue-400 token (src/index.css).
const BLUE = "#75d5f6";
const categories = {
  health: {
    label: "ارزش غذایی",
    Icon: PiHeartbeat,
    background: "bg-[#FFB7BC]",
    labelWidth: "w-full",
  },
  cost: {
    label: "مدیریت هزینه",
    Icon: PiCoins,
    background: "bg-[#FCECAD]",
    labelWidth: "max-w-[4em]",
  },
  environment: {
    label: "محیط زیست",
    Icon: PiPlant,
    background: "bg-[#AAFFC9]",
    labelWidth: "w-full",
  },
  accessibility: {
    label: "سهولت تهیه",
    Icon: PiAlarm,
    background: "bg-[#C8E0FF]",
    labelWidth: "max-w-[3.5em]",
  },
};

// Chart.js places axes clockwise from the top, independently of RTL text.
const positions = [
  "col-start-2 row-start-1",
  "col-start-3 row-start-2",
  "col-start-2 row-start-3",
  "col-start-1 row-start-2",
];
const percentFormatter = new Intl.NumberFormat("fa-IR", {
  maximumFractionDigits: 1,
});
const formatPercent = (value: number) => `${percentFormatter.format(value)}٪`;

const RadarChart = ({ radar }: RadarChartProps) => {
  const { theme } = useDashboardTheme();
  const isDark = theme === "dark";
  const gridColor = isDark ? "#416574" : "#70bdd8";
  const axes = getRadarDisplayAxes(radar);
  const currentValues = axes.map(({ plotValue }) => plotValue);

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
        max: 200,
        startAngle: 0,
        ticks: { display: false, stepSize: 50 },
        pointLabels: { display: false },

        grid: { circular: true, color: gridColor, lineWidth: 1 },
        angleLines: { color: gridColor, lineWidth: 1 },
      },
    },
  };

  const data: ChartData<"radar"> = {
    labels: axes.map(({ key }) => categories[key].label),
    datasets: [
      {
        label: "الگوی کنونی",
        data: currentValues,
        borderColor: BLUE,
        backgroundColor: isDark
          ? "rgba(126, 187, 208, 0.22)"
          : "rgba(117, 213, 246, 0.14)",
        borderWidth: 1.5,
        fill: "shape",
        showLine: true,
        spanGaps: false,
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
        data: axes.map(() => 100),
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
      className="mx-auto grid w-full min-w-0 max-w-116 grid-cols-[18%_64%_18%] items-center gap-y-1 font-peyda fold:grid-cols-[max-content_minmax(0,1fr)_max-content] fold:gap-y-2"
    >
      <div className="relative col-start-2 row-start-2 aspect-square w-full min-h-0 min-w-0">
        <Radar
          className="absolute inset-0"
          data={data}
          options={options}
          role="img"
          aria-label={axes
            .map(
              ({ key, value, overflow }) =>
                `${categories[key].label}: الگوی کنونی ${formatPercent(value)}، توازن بهینه ۱۰۰٪${overflow ? "، فراتر از مقیاس ۲۰۰٪" : ""}`,
            )
            .join("؛ ")}
        />
      </div>
      {axes.map(({ key, overflow }, index) => {
        const { label, Icon, background, labelWidth } = categories[key];
        return (
          <div
            key={key}
            dir="rtl"
            className={`${positions[index]} flex min-w-0 flex-col items-center justify-center gap-y-2 text-center font-peyda text-xs font-bold compact:text-xs mobile:text-sm fold:justify-self-center fold:text-base laptop:text-lg`}
          >
            <span
              className={`${background} flex size-7 shrink-0 items-center justify-center rounded-full text-black compact:size-7 mobile:size-8 fold:size-9 laptop:size-10`}
            >
              <Icon
                aria-hidden="true"
                className="compact:text-lg mobile:text-xl fold:text-2xl laptop:text-3xl"
              />
            </span>
            <span
              className={`${labelWidth} leading-[130%] fold:w-auto fold:max-w-none fold:whitespace-nowrap dark:text-white`}
            >
              {label}
            </span>
            {overflow && (
              <span className="rounded bg-blue-200 px-1 text-xs dark:bg-darker-blue-300 dark:text-white">
                بیش از ۲۰۰٪
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RadarChart;
