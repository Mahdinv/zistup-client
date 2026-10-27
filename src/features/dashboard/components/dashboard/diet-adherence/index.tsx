import { memo, useState, type CSSProperties } from "react";
import { LuArrowUpLeft } from "react-icons/lu";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import type { DietAdherenceData } from "../../../api/types/diet-adherence.types";
import {
  adherenceScoreColors,
  getDietAdherenceDisplay,
  type AdherenceTone,
} from "../../../lib/diet-adherence.utils";
import DietAdherenceCircularScore from "./diet-adherence-circular-score";
import DietAdherenceDetailsDrawer from "./diet-adherence-details-drawer";
import {
  LoadingRegion,
  LoadingShape,
  RingSkeleton,
} from "../dashboard-skeleton";

type DietAdherenceProps = {
  isToday: boolean;
  data?: DietAdherenceData;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

const darkMessageColors: Record<AdherenceTone, string> = {
  neutral: "dark:text-white",
  low: "dark:text-red-200",
  medium: "dark:text-yellow-300",
  "yellow-green": "dark:text-[#C7EC75]",
  "light-green": "dark:text-green-300",
  high: "dark:text-green-700",
};

const DietAdherenceScore = ({
  isToday,
  data,
  isLoading,
  error,
  onRetry,
}: DietAdherenceProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const display = getDietAdherenceDisplay(data);
  const unavailable = isLoading || Boolean(error);
  const message = isLoading ? "در حال دریافت امتیاز…" : display.message;
  const messageTone = isLoading ? "neutral" : display.tone;

  return (
    <>
      <div
        aria-busy={isLoading}
        className="w-full bg-blue-100 dark:bg-darker-blue-400 border border-gray-100 dark:border-dark rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(0,0,0,0.04)] flex flex-col justify-center items-center gap-4"
      >
        <div className="w-full min-h-5.5 flex flex-row items-center justify-between gap-2">
          <h2 className="font-yekan font-extrabold leading-[135%] compact:text-lg fold:text-xl laptop:text-2xl">
            {isToday ? "امتیاز تعادل امروز" : "امتیاز تعادل روز انتخاب‌شده"}
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setDetailsOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={detailsOpen}
            className="text-blue-400 hover:text-blue-500 active:text-blue-500 inline-flex shrink-0 items-center gap-1 whitespace-nowrap cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <span className="font-peyda font-bold leading-[140%] compact:text-sm fold:text-base laptop:text-lg">
              بررسی دقیق‌تر
            </span>
            <LuArrowUpLeft
              aria-hidden="true"
              viewBox="4 4 16 16"
              className="size-5 shrink-0 fold:size-6 laptop:size-7"
              strokeWidth={2}
            />
          </button>
        </div>
        {isLoading ? (
          <LoadingRegion label="در حال دریافت امتیاز">
            <RingSkeleton />
          </LoadingRegion>
        ) : (
          <div>
            <DietAdherenceCircularScore
              value={unavailable ? null : display.value}
              max={display.max}
              progress={unavailable ? 0 : display.progress}
              tone={unavailable ? "neutral" : display.tone}
            />
          </div>
        )}
        <div className="w-full min-h-8.25 fold:min-h-10 laptop:min-h-11 border border-blue-300 dark:border-dark text-center rounded-[42px] px-3 flex items-center justify-center">
          {isLoading ? (
            <LoadingShape className="h-4 w-2/3 rounded" />
          ) : error ? (
            <button
              type="button"
              onClick={onRetry}
              title={getApiErrorMessage(error)}
              className="w-full truncate font-yekan font-extrabold text-sm fold:text-lg laptop:text-xl text-red-400 dark:text-red-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full"
            >
              <span role="alert" className="sr-only">
                {getApiErrorMessage(error)}
              </span>
              دریافت امتیاز ناموفق بود؛ تلاش مجدد
            </button>
          ) : (
            <p
              role="status"
              title={message}
              style={
                {
                  "--adherence-message-color":
                    messageTone === "neutral"
                      ? "var(--color-dark)"
                      : `color-mix(in srgb, ${adherenceScoreColors[messageTone]} 45%, black)`,
                } as CSSProperties
              }
              className={`w-full whitespace-normal wrap-break-word py-1 font-yekan font-extrabold leading-[135%] text-base fold:text-lg laptop:text-xl text-(--adherence-message-color) ${darkMessageColors[messageTone]}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <DietAdherenceDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        data={data}
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
      />
    </>
  );
};

export default memo(DietAdherenceScore);
