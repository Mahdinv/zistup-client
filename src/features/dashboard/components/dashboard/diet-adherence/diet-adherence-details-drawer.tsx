import { motion, useReducedMotion } from "framer-motion";
import { PiXCircle } from "react-icons/pi";
import BaseDrawer from "@/shared/base-components/base-drawer";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import { groupsColor } from "@/shared/constants/food-group-colors.constants";
import type { DietAdherenceData } from "../../../api/types/diet-adherence.types";
import { useDashboardTheme } from "../../../hooks/use-dashboard-theme.hook";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: DietAdherenceData;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
};

const formatRounded = (value: number | null) =>
  value !== null && Number.isFinite(value)
    ? Math.round(value).toLocaleString("fa-IR")
    : "—";

export default function DietAdherenceDetailsDrawer({
  open,
  onOpenChange,
  data,
  isLoading,
  error,
  onRetry,
}: Props) {
  const { theme } = useDashboardTheme();
  const reducedMotion = useReducedMotion();
  const categories = data?.categories ?? [];

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="تحلیل امتیاز تعادل"
      description="مقایسه مصرف گروه‌های غذایی با هدف روز انتخاب‌شده"
      theme={theme}
      appearance="quick-add-meal"
      closeIcon={<PiXCircle aria-hidden="true" className="size-6" />}
      className="font-peyda **:data-[slot=drawer-title]:font-peyda [&>div>header]:px-5 **:data-[slot=drawer-close]:text-blue-900 **:data-[slot=base-drawer-body]:px-3 **:data-[slot=base-drawer-body]:py-4 **:data-[slot=base-drawer-footer]:px-3"
      stickyFooter={false}
      footer={
        <section className="min-h-22 bg-green-200 dark:bg-darker-blue-300 p-3 flex flex-col gap-1 font-peyda text-base leading-[140%] shadow-[0_4px_4px_#0000000a] dark:shadow-none">
          <h3 className="font-bold text-green-400">توصیه زیستاپ</h3>
          <p className="font-medium text-darker-green-200 dark:text-green-100">
            {isLoading
              ? "در حال دریافت اطلاعات…"
              : error
                ? "توصیه در حال حاضر در دسترس نیست."
                : data?.message_code || "توصیه‌ای برای این روز در دسترس نیست."}
          </p>
        </section>
      }
    >
      <div aria-busy={isLoading} className="min-h-100">
        {isLoading ? (
          <div
            role="status"
            aria-label="در حال دریافت جزئیات امتیاز تعادل"
            className="flex flex-col gap-2"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-15 rounded-xs bg-blue-300 dark:bg-darker-blue-400 animate-pulse motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-8 text-center text-base"
          >
            <p>{getApiErrorMessage(error)}</p>
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-primary-green px-4 py-2"
            >
              تلاش مجدد
            </button>
          </div>
        ) : categories.length === 0 ? (
          <p role="status" className="py-8 text-center text-base">
            جزئیات گروه‌های غذایی برای این روز در دسترس نیست.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((category) => {
              const percent = category.consumption_percent;
              const hasPercent = percent !== null && Number.isFinite(percent);
              const progress = hasPercent
                ? Math.min(100, Math.max(0, percent))
                : 0;
              const color =
                groupsColor.find((group) => group.id === category.key)?.color ??
                "var(--color-gray-400)";

              return (
                <li
                  key={category.key}
                  className="min-h-15 rounded-xs bg-blue-300 dark:bg-darker-blue-400 p-3 flex flex-col gap-2 shadow-[0_4px_4px_#0000000a] dark:shadow-none"
                >
                  <div className="min-h-5 flex items-center justify-between gap-2 px-1 font-peyda font-bold text-darker-green-200 dark:text-white">
                    <p className="min-w-0 text-right text-base leading-[140%]">
                      {category.label}: حدود{" "}
                      <bdi
                        dir="ltr"
                        className="inline-block whitespace-nowrap font-rokh normal-nums tracking-normal"
                      >
                        {formatRounded(category.consumed_g)}
                      </bdi>{" "}
                      گرم{" "}
                      <bdi
                        dir="ltr"
                        className="inline-block whitespace-nowrap font-rokh normal-nums tracking-normal"
                        style={{ color }}
                      >
                        ({hasPercent ? `${formatRounded(percent)}٪` : "—"})
                      </bdi>
                    </p>
                    <span className="shrink-0 whitespace-nowrap text-right text-xs leading-[120%]">
                      هدف:{" "}
                      <bdi
                        dir="ltr"
                        className="inline-block whitespace-nowrap font-rokh normal-nums tracking-normal"
                      >
                        {formatRounded(category.target_g)}
                      </bdi>{" "}
                      گرم
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={category.label}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={hasPercent ? progress : undefined}
                    aria-valuetext={
                      hasPercent
                        ? `${formatRounded(percent)}٪`
                        : "درصد مصرف در دسترس نیست"
                    }
                    className="h-2 w-full overflow-hidden rounded-xs bg-[#C3E6F3] dark:bg-darker-blue-500"
                    style={{ color }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-current"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={
                        reducedMotion
                          ? { duration: 0 }
                          : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
                      }
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </BaseDrawer>
  );
}
