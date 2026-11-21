import { useRef, useState } from "react";
import Button from "@/shared/base-components/button";
import {
  clarityEnabled,
  readAnalyticsConsent,
  setAnalyticsConsent,
} from "./clarity";

export default function AnalyticsConsent() {
  const [open, setOpen] = useState(() => readAnalyticsConsent() === null);
  const trigger = useRef<HTMLButtonElement>(null);
  if (!clarityEnabled) return null;

  const choose = (value: "granted" | "denied") => {
    setAnalyticsConsent(value);
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <aside
      dir="rtl"
      aria-label="حریم خصوصی و آمار استفاده"
      className="fixed left-3 top-[calc(0.75rem+env(safe-area-inset-top))] z-10000 max-w-[calc(100%-1.5rem)] font-peyda text-gray-900"
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="analytics-consent-panel"
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs shadow focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        حریم خصوصی
      </button>
      {open && (
        <section
          id="analytics-consent-panel"
          aria-labelledby="analytics-consent-title"
          className="mt-2 w-96 max-w-full rounded-2xl border border-gray-300 bg-white p-4 shadow-xl"
        >
          <h2 id="analytics-consent-title" className="font-bold">
            آمار اختیاری استفاده
          </h2>
          <p className="my-3 text-sm leading-6">
            با اجازه شما، Microsoft Clarity کلیک، پیمایش و تعامل شما را فقط در
            صفحه‌های عمومیِ بررسی‌شده ضبط می‌کند تا زیستاپ را بهتر کنیم. متن و
            تصاویر پوشانده می‌شوند؛ صفحه‌های سلامت، رژیم، حساب و ورود ضبط
            نمی‌شوند. کوکی تحلیلی استفاده می‌شود و تبلیغات غیرفعال است. رد کردن
            مانع استفاده از برنامه نیست. لغو رضایت ممکن است صفحه را دوباره
            بارگذاری کند.
          </p>
          <div className="flex gap-2">
            <Button
              title="نمی‌پذیرم"
              onClick={() => choose("denied")}
              classes="rounded-xl border border-gray-400 bg-white focus-visible:ring-2 focus-visible:ring-blue-600"
            />
            <Button
              title="می‌پذیرم"
              onClick={() => choose("granted")}
              classes="rounded-xl border border-gray-400 bg-white focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>
        </section>
      )}
    </aside>
  );
}
