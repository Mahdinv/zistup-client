import { useEffect, useRef } from "react";
import {
  Filler,
  RadialLinearScale,
  type Chart,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { PiAlarm, PiCoins, PiHeartbeat, PiPlant } from "react-icons/pi";

import ChartJS from "@/shared/lib/chartjs-setup";
import { useDashboardTheme } from "@/features/dashboard/hooks/use-dashboard-theme.hook";
import type { RadarData } from "../../../api/types/radar.types";
import { getRadarDisplayAxes } from "../../../lib/radar.utils";
import { LoadingShape } from "../dashboard-skeleton";

ChartJS.register(RadialLinearScale, Filler);

type RadarChartProps = {
  radar?: RadarData;
  isLoading?: boolean;
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
  maximumFractionDigits: 0,
});
const formatPercent = (value: number | null) =>
  value === null ? "ناموجود" : `${percentFormatter.format(Math.round(value))}٪`;

const RadarChart = ({ radar, isLoading = false }: RadarChartProps) => {
  const { theme } = useDashboardTheme();
  const chartRef = useRef<Chart<"radar">>(null);
  const isDark = theme === "dark";
  const gridColor = isDark ? "#416574" : "#70bdd8";
  const axes = getRadarDisplayAxes(radar);
  const currentValues = axes.map(({ score }) => score);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const close = () => {
      chart.setActiveElements([]);
      chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      chart.draw();
    };
    const onOutsidePointerDown = (event: PointerEvent) => {
      if (event.target !== chart.canvas) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    close();
    document.addEventListener("pointerdown", onOutsidePointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [radar, isLoading]);

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    events: ["click"],
    interaction: { mode: "nearest", intersect: true },
    layout: { padding: 2 },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "#0d0e12",
        borderColor: "#292f37",
        borderWidth: 0.5,
        cornerRadius: 12,
        padding: 10,
        bodyColor: BLUE,
        bodyFont: { family: "Peyda", size: 18, weight: "bold" },
        titleFont: { family: "Peyda", size: 12 },
        rtl: true,
        textDirection: "rtl",
        usePointStyle: true,
        callbacks: {
          label: ({ raw }) =>
            formatPercent(typeof raw === "number" ? raw : null),
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        startAngle: 0,
        ticks: { display: false, stepSize: 25 },
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
        fill: currentValues.every((value) => value !== null) ? "shape" : false,
        showLine: true,
        spanGaps: false,
        tension: 0,
        pointBackgroundColor: BLUE,
        pointBorderColor: isDark ? "#1b1a20" : "#eef8fb",
        pointBorderWidth: 1.5,
        pointHitRadius: 14,
        pointRadius: ({ chart }) =>
          Math.max(2.5, Math.min(6, chart.width / 47)),
        order: 0,
      },
    ],
  };

  return (
    <div
      dir="ltr"
      className="mx-auto grid w-full min-w-0 max-w-116 grid-cols-[18%_64%_18%] items-center gap-y-1 font-peyda fold:grid-cols-[max-content_minmax(0,1fr)_max-content] fold:gap-y-2"
    >
      <div className="relative col-start-2 row-start-2 aspect-square w-full min-h-0 min-w-0">
        {isLoading ? (
          <div className="absolute inset-2">
            <LoadingShape className="size-full rounded-full" />
            <div className="absolute inset-[20%] rounded-full border border-blue-100 dark:border-darker-blue-400" />
            <div className="absolute inset-[36%] rounded-full border border-blue-100 dark:border-darker-blue-400" />
          </div>
        ) : (
          <Radar
            ref={chartRef}
            className="absolute inset-0"
            data={data}
            options={options}
            role="img"
            aria-label={axes
              .map(
                ({ key, score }) =>
                  `${categories[key].label}: ${formatPercent(score)}`,
              )
              .join("؛ ")}
          />
        )}
      </div>
      {axes.map(({ key }, index) => {
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
          </div>
        );
      })}
    </div>
  );
};

export default RadarChart;
