import ComboBox from "@/shared/base-components/combo-box";
import { memo, useState } from "react";
import LineChart from "./line-chart";

// Temporary values until detailed-monitoring API data is available.
const chartData = {
  labels: ["زینک", "کلسیم", "منیزیم", "پتاسیم"],
  currentValues: [13, 17, 5, 20],
  referenceValues: [13, 20, 12, 25],
  unit: "mcg",
};

const chartFilterOptions = [
  { label: "خانواده B", value: "b-family" },
  { label: "درشت مغذی", value: "macrocephaly" },
  { label: "ماده معدنی", value: "mineral" },
  { label: "محلول در آب", value: "water-soluble" },
  { label: "ویتامین محلول در چربی", value: "fat-soluble-vitamin" },
  { label: "محیط زیست", value: "environment" },
  { label: "دیگر", value: "other" },
];

const DetailedMonitoring = () => {
  const [chartFilter, setChartFilter] = useState<string | null>(null);

  return (
    <div
      className="
                    w-full
                    bg-blue-100 dark:bg-darker-blue-400
                    border border-gray-100 dark:border-dark
                    rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)]
                    flex flex-col justify-center items-start gap-4
                "
    >
      <div
        className="
                  w-full
                  compact:min-h-6 fold:min-h-8 laptop:min-h-10
                  flex flex-row flex-wrap justify-between items-start gap-3
                "
      >
        <div className="flex-1 flex flex-col items-start compact:gap-1 fold:gap-2 laptop:gap-3">
          <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl desktop:text-2xl">
            پایش جزئی
          </h2>
          <div className="flex flex-row items-center gap-2 desktop:gap-4">
            <div className="flex flex-row items-center gap-1 desktop:gap-2">
              <div className="bg-blue-400 compact:size-2 fold:size-3 desktop:size-4 rounded-full" />
              <label className="text-blue-400 font-peyda font-bold compact:text-xxs mobile:text-xs fold:text-base laptop:text-xs desktop:text-lg">
                الگوی کنونی
              </label>
            </div>
            <div className="flex flex-row items-center gap-1 desktop:gap-2">
              <div className="bg-transparent border border-dashed border-black dark:border-white compact:size-2 fold:size-3 desktop:size-4 rounded-full" />
              <label className="font-peyda font-bold compact:text-xxs mobile:text-xs fold:text-base laptop:text-xs desktop:text-lg">
                توازن بهینه
              </label>
            </div>
          </div>
        </div>

        <ComboBox
          variant="blue"
          className="w-auto! compact:min-w-35 fold:min-w-44 laptop:min-w-40 desktop::min-w-56"
          placeholder="مواد معدنی"
          options={chartFilterOptions}
          value={chartFilter}
          onChange={setChartFilter}
        />
      </div>
      <LineChart {...chartData} />
    </div>
  );
};

export default memo(DetailedMonitoring);
