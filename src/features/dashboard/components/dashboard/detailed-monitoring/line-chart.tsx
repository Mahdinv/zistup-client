import { useMemo, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Filler,
  type Chart,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from "chart.js";

import { getRelativePosition } from "chart.js/helpers";

import "@/shared/lib/chartjs-setup";
import { useDashboardTheme } from "@/features/dashboard/hooks/use-dashboard-theme.hook";
import type { Nutrient } from "../../../api/types/nutrition.types";
import { getNutrientComparison } from "../../../lib/nutrition.utils";

type LineChartProps = {
  nutrients: Nutrient[];
};

const plugins: Plugin<"line">[] = [
  Filler,
  {
    id: "line-chart-tooltip-position",
    afterDatasetsDraw(chart) {
      const {
        ctx,
        scales: { x, y },
      } = chart;
      ctx.save();
      ctx.strokeStyle = String(chart.options.scales?.x?.ticks?.color);
      ctx.lineWidth = 1.5;
      chart.data.datasets[0].data.forEach((value, index) => {
        if (value !== null) return;
        // A dash marks missing consumption; it is not a plotted zero or line segment.
        const left = x.getPixelForValue(index);
        const baseline = y.getPixelForValue(0);
        ctx.beginPath();
        ctx.moveTo(left - 3, baseline);
        ctx.lineTo(left + 3, baseline);
        ctx.stroke();
      });
      ctx.restore();
    },
    afterDraw(chart) {
      // Re-anchor a pinned tooltip after a responsive chart layout/update.
      const tooltip = chart.tooltip;
      if (tooltip?.opacity && tooltip.options.external) {
        tooltip.options.external.call(tooltip, { chart, tooltip });
      }
    },
  },
];

const LineChart = ({ nutrients }: LineChartProps) => {
  const { theme } = useDashboardTheme();
  const chartRef = useRef<Chart<"line">>(null);
  const gradientRef = useRef<{ key: string; value: CanvasGradient } | null>(
    null,
  );
  const tooltipRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const referenceRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef<HTMLSpanElement>(null);

  const { data, options } = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const color = (name: string) =>
      styles.getPropertyValue(`--color-${name}`).trim();
    const isDark = theme === "dark";
    const labels = nutrients.map(({ name }) => name);
    const comparisons = nutrients.map(getNutrientComparison);
    const currentValues = comparisons.map(({ current }) => current);
    const referenceValues = comparisons.map(({ target }) => target);

    const data: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: "الگوی کنونی",
          data: currentValues,
          borderColor: color("blue-400"),
          borderWidth: 2.5,
          tension: 0.35,
          spanGaps: false,
          clip: 8,
          fill: "origin",
          backgroundColor: ({ chart }) => {
            const area = chart.chartArea;
            if (!area) return "transparent";
            const bounds = `${theme}:${area.top}:${area.bottom}:${area.left}:${area.right}:${chart.currentDevicePixelRatio}`;
            if (gradientRef.current?.key !== bounds) {
              const gradient = chart.ctx.createLinearGradient(
                0,
                area.top,
                0,
                area.bottom,
              );
              // Keep the specified hues, with transparency over the dark card.
              gradient.addColorStop(0, isDark ? "#75D5F64D" : "#75D5F6");
              gradient.addColorStop(1, isDark ? "#FFFFFF00" : "#FFFFFF");
              gradientRef.current = { key: bounds, value: gradient };
            }
            return gradientRef.current.value;
          },
          pointBackgroundColor: "#8CD0E7",
          pointHoverBackgroundColor: "#8CD0E7",
          pointBorderColor: color(isDark ? "darker-blue-400" : "blue-100"),
          pointBorderWidth: 1.5,
          pointRadius: ({ chart }) =>
            Math.max(3.5, Math.min(5.5, chart.width / 90)),
          pointHoverRadius: 6,
          pointHitRadius: 14,
          order: 0,
        },
        {
          label: "توازن بهینه",
          data: referenceValues,
          borderColor: color(isDark ? "blue-200" : "darker-blue-400"),
          borderWidth: 1.5,
          borderDash: [6, 4],
          borderCapStyle: "round",
          tension: 0.35,
          fill: false,
          spanGaps: false,
          clip: 8,
          pointRadius: ({ dataIndex }) =>
            referenceValues[dataIndex] === 0 ? 3 : 0,
          pointHoverRadius: 0,
          order: 1,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      // Pointer Events below handle hover and taps without synthetic mouse events.
      events: [],
      interaction: { mode: "index", intersect: false, axis: "x" },
      layout: { padding: { top: 12, right: 6, bottom: 0, left: 6 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: false,
          external: ({ chart, tooltip }) => {
            const element = tooltipRef.current;
            const pointer = pointerRef.current;
            const current = currentRef.current;
            const reference = referenceRef.current;
            if (!element || !pointer || !current || !reference) return;
            const index = tooltip.dataPoints?.[0]?.dataIndex;
            if (!tooltip.opacity || index === undefined) {
              element.style.opacity = "0";
              return;
            }
            const nutrient = nutrients[index];
            if (!nutrient) return;
            current.textContent = comparisons[index].currentLabel;
            reference.textContent = comparisons[index].targetLabel;
            const point = chart.getDatasetMeta(
              currentValues[index] === null ? 1 : 0,
            ).data[index];
            if (!point) return;
            const { x, y } = point.getProps(["x", "y"], true);
            const width = element.offsetWidth;
            const height = element.offsetHeight;
            const gap = 14;
            const left = Math.max(
              0,
              Math.min(x - width / 2, chart.width - width),
            );
            const below = y < height + gap;
            const top = Math.max(
              0,
              Math.min(
                below ? y + gap : y - height - gap,
                chart.height - height,
              ),
            );
            element.style.transform = `translate(${left}px, ${top}px)`;
            element.style.opacity = "1";
            pointer.style.left = `${Math.max(10, Math.min(x - left, width - 10))}px`;
            pointer.style.top = below ? "-5px" : "auto";
            pointer.style.bottom = below ? "auto" : "-5px";
            pointer.style.transform = `translateX(-50%) rotate(${below ? 45 : 225}deg)`;
          },
        },
      },
      scales: {
        x: {
          offset: true,
          border: { display: false },
          grid: { display: false, drawTicks: false },
          ticks: {
            color: color(isDark ? "blue-200" : "blue-600"),
            padding: 8,
            maxRotation: 90,
            autoSkip: false,
            autoSkipPadding: 14,
            font: ({ chart }) => {
              const font = getComputedStyle(chart.canvas);
              return {
                family: font.fontFamily,
                size: Math.max(
                  10,
                  Math.min(
                    parseFloat(font.fontSize),
                    chart.width / Math.max(1, nutrients.length) / 3,
                  ),
                ),
                weight: 700,
              };
            },
          },
        },
        y: {
          beginAtZero: true,
          min: 0,
          max: 110,
          border: { display: false },
          ticks: { display: false, count: 5 },
          grid: {
            color: color(isDark ? "darker-blue-100" : "blue-300"),
            drawTicks: false,
            lineWidth: 1,
          },
        },
      },
    };
    return { data, options };
  }, [nutrients, theme]);

  useEffect(() => {
    const chart = chartRef.current;
    const tooltip = tooltipRef.current;

    if (!chart || !tooltip) return;
    const canvas = chart.canvas;

    const hover = window.matchMedia(
      "(hover: hover) and (pointer: fine), (any-hover: hover) and (any-pointer: fine)",
    );
    let mounted = true;
    let pinned = false;
    let press: { id: number; x: number; y: number } | null = null;
    const usesHover = (event: PointerEvent) =>
      event.pointerType === "mouse" && hover.matches;

    const unpin = () => {
      pinned = false;
      tooltip.style.pointerEvents = "none";
      document.removeEventListener("pointerdown", onOutsidePointerDown, true);
    };
    const close = () => {
      unpin();
      chart.setActiveElements([]);
      chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      tooltip.style.opacity = "0";
      chart.draw();
    };
    function onOutsidePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !canvas.parentElement?.contains(event.target)
      ) {
        close();
      }
    }
    const select = (event: PointerEvent, persist: boolean) => {
      const position = getRelativePosition(event, chart);
      if (!chart.isPointInArea(position)) {
        close();
        return;
      }
      // Resolve the category directly so missing values never select a neighbor.
      const index = chart.scales.x.getValueForPixel(position.x);
      const elements =
        index === undefined
          ? []
          : chart.data.datasets.flatMap((dataset, datasetIndex) =>
              dataset.data[index] == null ? [] : [{ datasetIndex, index }],
            );
      if (!elements.length) {
        close();
        return;
      }
      if (persist) {
        pinned = true;
        tooltip.style.pointerEvents = "auto";
        document.addEventListener("pointerdown", onOutsidePointerDown, {
          capture: true,
          passive: true,
        });
      } else {
        unpin();
      }
      chart.setActiveElements(elements);
      chart.tooltip?.setActiveElements(elements, position);
      chart.draw();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary && event.button === 0) {
        press = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      // A drag/scroll is not a tap, even if the finger moves back before release.
      if (
        press &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 10
      ) {
        press = null;
      }
      if (usesHover(event) && !pinned) select(event, false);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (press?.id === event.pointerId) select(event, true);
      press = null;
    };
    const onPointerCancel = () => {
      press = null;
    };
    const onPointerLeave = () => {
      press = null;
      if (!pinned) close();
    };

    // Passive listeners allow native scrolling; touch pointerleave does not unpin.
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", onPointerUp, { passive: true });
    canvas.addEventListener("pointercancel", onPointerCancel, {
      passive: true,
    });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    close();
    // Canvas text must be measured again once the existing Persian font loads.
    void document.fonts.ready.then(() => {
      if (mounted) chart.update("none");
    });
    return () => {
      mounted = false;
      unpin();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [data]);

  return (
    <div className="w-full min-w-0">
      <div className="relative h-72 w-full min-w-0 font-peyda text-sm mobile:text-base fold:text-lg desktop:h-64">
        <Line
          ref={chartRef}
          data={data}
          options={options}
          plugins={plugins}
          role="img"
          aria-label={nutrients
            .map((nutrient) => {
              const comparison = getNutrientComparison(nutrient);
              return `${nutrient.name}: الگوی کنونی ${comparison.currentLabel}، توازن بهینه ${comparison.targetLabel}`;
            })
            .join("؛ ")}
        />
        <div
          ref={tooltipRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 z-10 max-w-full rounded-xl border-[0.5px] border-dark bg-darker-blue-500 px-3 py-2 font-peyda text-lg leading-tight opacity-0 shadow-md motion-safe:transition-[transform,opacity] motion-safe:duration-100"
        >
          <span
            ref={pointerRef}
            className="absolute size-2.5 border-t-[0.5px] border-l-[0.5px] border-dark bg-darker-blue-500"
          />
          <div
            dir="ltr"
            className="relative flex items-center gap-2 text-blue-400"
          >
            <span className="size-2.5 shrink-0 rounded-full bg-blue-400" />
            <span ref={currentRef} className="font-bold tabular-nums" />
          </div>
          <div
            dir="ltr"
            className="relative mt-1 flex items-center gap-2 text-white"
          >
            <span className="size-2.5 shrink-0 rounded-full border-[1.5px] border-dashed border-white" />
            <span ref={referenceRef} className="font-bold tabular-nums" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
