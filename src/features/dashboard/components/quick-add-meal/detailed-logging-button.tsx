import { PiFadersFill } from "react-icons/pi";
import { HiOutlineChevronLeft } from "react-icons/hi";

export default function DetailedLoggingButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      dir="rtl"
      onClick={onClick}
      className="mt-4 flex w-full min-w-0 items-center justify-between gap-2 rounded-2xl border border-[#292F37] bg-darker-blue-500 px-3 py-[9px] text-right font-peyda focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-darker-blue-200">
          <PiFadersFill size={24} className="text-blue-400" aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-col leading-[1.4]">
          <span className="text-base font-bold text-blue-400">
            ثبت تفکیک شده
          </span>
          <span className="text-sm font-medium text-blue-900">
            مقدار هر بخش رو دقیق‌تر ثبت کن
          </span>
        </span>
      </span>
      <HiOutlineChevronLeft
        size={24}
        className="shrink-0 text-blue-400"
        aria-hidden="true"
      />
    </button>
  );
}
