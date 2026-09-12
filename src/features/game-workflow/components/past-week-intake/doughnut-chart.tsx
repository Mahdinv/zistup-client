import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartOptions, Plugin } from "chart.js";

type DoughnutChartChartProps = {
  chartData: {
    categoryId: number;
    categoryTitle: string;
    totalPercentUsage: number;
    color: string;
  }[];
  registeredCount: number;
};

const DoughnutChart = ({
  chartData,
  registeredCount,
}: DoughnutChartChartProps) => {
  const activeData = useMemo(
    () => chartData.filter((item) => item.totalPercentUsage > 0),
    [chartData],
  );

  const isEmpty = activeData.length === 0;

  const data = useMemo(
    () =>
      isEmpty
        ? {
            labels: ["داده‌ای برای نمایش وجود ندارد"],
            datasets: [
              {
                label: "میزان مصرف",
                data: [100],
                backgroundColor: ["#D1D5DB"],
                borderWidth: 0,
              },
            ],
          }
        : {
            labels: activeData.map((item) => item.categoryTitle),
            datasets: [
              {
                label: "میزان مصرف",
                data: activeData.map((item) => item.totalPercentUsage),
                backgroundColor: activeData.map((item) => item.color),
                borderWidth: 0,
              },
            ],
          },
    [activeData, isEmpty],
  );

  const centerTextPlugin = useMemo<Plugin<"doughnut">>(
    () => ({
      id: `centerText-${registeredCount}`,
      afterDraw(chart) {
        const { ctx } = chart;

        const meta = chart.getDatasetMeta(0);
        const firstArc = meta.data[0];

        if (!firstArc) return;

        const { x, y } = firstArc;

        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "800 24px RokhFaNum";
        ctx.fillText(`${registeredCount}`, x, y - 10);

        ctx.fillStyle = "#D1D5DB";
        ctx.font = "500 8px Peyda";
        ctx.fillText("مورد ثبت شده", x, y + 16);

        ctx.restore();
      },
    }),
    [registeredCount],
  );

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    events: [],
    cutout: "68%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-center compact:gap-4 tablet:gap-2 laptop:gap-4">
      <div className="relative mx-auto aspect-square min-w-0 max-w-full shrink-0 overflow-hidden compact:w-36 mobile:w-44 mobile-lg:w-48 fold:w-60 tablet:w-52 laptop:w-48">
        <Doughnut
          key={registeredCount}
          data={data}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>

      <div
        className={`w-full min-w-0 ${
          activeData.length <= 1
            ? "flex"
            : "grid compact:grid-cols-1 mobile-lg:grid-cols-2 items-center"
        } self-start compact:gap-2 mobile-lg:gap-2 fold:gap-4 tablet:gap-2 laptop:gap-1`}
      >
        {isEmpty ? (
          <div className="flex w-full min-w-0 flex-row items-center gap-2">
            <div className="w-4 shrink-0 aspect-square rounded-full bg-[#D1D5DB]" />

            <small className="min-w-0 flex-1 text-white compact:text-sm fold:text-base laptop:text-lg font-normal font-peyda!">
              داده‌ای برای نمایش وجود ندارد
            </small>
          </div>
        ) : (
          activeData.map((item) => (
            <div
              key={item.categoryId}
              className="flex w-full min-w-0 flex-row items-center gap-2 mobile-lg:px-2 fold:px-4 tablet:px-2 laptop:px-1"
            >
              <div
                className="w-4 shrink-0 aspect-square rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <small className="min-w-0 flex-1 text-white font-normal font-peyda!">
                {item.categoryTitle}
              </small>

              <span className="shrink-0 text-white text-sm font-medium font-peyda">
                {item.totalPercentUsage.toFixed(2)}%
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoughnutChart;
