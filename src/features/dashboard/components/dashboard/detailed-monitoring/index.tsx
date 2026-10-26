import ComboBox from "@/shared/base-components/combo-box";
import { memo, useMemo, useState } from "react";
import LineChart from "./line-chart";
import type { Nutrient } from "../../../api/types/nutrition.types";
import { getApiErrorMessage } from "@/shared/api/error.helpers";

type DetailedMonitoringProps = {
  nutrients?: Nutrient[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

const emptyNutrients: Nutrient[] = [];
const subgroupOrder = [
  "درشت‌مغذی",
  "خانواده B",
  "ماده معدنی",
  "محلول در آب",
  "ویتامین محلول در چربی",
  "محیط زیست",
];
const subgroupLabel = (value: string) =>
  value.replace(/\u200c/g, "").startsWith("محلول در آب")
    ? "محلول در آب"
    : value;
const subgroupRank = (value: string) => {
  if (value.trim() === "دیگر") return Infinity;
  const index = subgroupOrder.indexOf(subgroupLabel(value));
  return index < 0 ? subgroupOrder.length : index;
};

const DetailedMonitoring = ({
  nutrients = emptyNutrients,
  isLoading,
  error,
  onRetry,
}: DetailedMonitoringProps) => {
  const [chartFilter, setChartFilter] = useState<string | null>(null);
  const chartFilterOptions = useMemo(
    () =>
      [...new Set(nutrients.map(({ subgroup }) => subgroup))]
        .sort(
          (a, b) =>
            subgroupRank(a) - subgroupRank(b) || a.localeCompare(b, "fa"),
        )
        .map((subgroup) => ({
          label: subgroupLabel(subgroup),
          value: subgroup,
        })),
    [nutrients],
  );
  const selectedSubgroup = chartFilterOptions.some(
    ({ value }) => value === chartFilter,
  )
    ? chartFilter
    : (chartFilterOptions.find(({ value }) => value === "ماده معدنی")?.value ??
      chartFilterOptions[0]?.value ??
      null);
  const filteredNutrients = useMemo(
    () => nutrients.filter(({ subgroup }) => subgroup === selectedSubgroup),
    [nutrients, selectedSubgroup],
  );

  return (
    <div
      aria-busy={isLoading}
      className="
                    w-full min-w-0
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
        <div className="flex-1 min-w-max flex flex-col items-start compact:gap-1 fold:gap-2 laptop:gap-3">
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
          className="w-auto! max-w-full min-w-44 desktop:min-w-56 [&_button>span:first-child]:whitespace-normal"
          placeholder="مواد معدنی"
          options={chartFilterOptions}
          value={selectedSubgroup}
          onChange={setChartFilter}
        />
      </div>
      {error ? (
        <button
          type="button"
          onClick={onRetry}
          title={getApiErrorMessage(error)}
          className="text-sm text-red-400 dark:text-red-200 cursor-pointer"
        >
          <span role="alert">{getApiErrorMessage(error)}</span> — تلاش مجدد
        </button>
      ) : isLoading ? (
        <p role="status">در حال دریافت اطلاعات تغذیه</p>
      ) : (
        <div className="relative w-full min-w-0">
          <LineChart nutrients={filteredNutrients} />
          {filteredNutrients.length === 0 && (
            <p
              role="status"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              داده‌ای موجود نیست
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(DetailedMonitoring);
