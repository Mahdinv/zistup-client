import usePwaInstall from "../hooks/use-pwa-install";

import Button from "@/shared/base-components/button";

const PwaInstallPrompt = () => {
  const { shouldShowPrompt, isIosOnly, install, dismiss } = usePwaInstall();

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <aside
      aria-label="نصب اپلیکیشن زیست‌آپ"
      className="
        fixed
        bottom-4
        left-1/2
        z-9999
        w-[calc(100%-2rem)]
        max-w-105
        -translate-x-1/2
        rounded-2xl
        bg-white
        p-4
        shadow-2xl
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <img src="/pwa/app-icon.svg" alt="" className="h-14 w-14 shrink-0" />
        <div className="min-w-0">
          <h2 className="font-yekan text-xl font-extrabold text-darker-blue-200">
            نصب زیست‌آپ
          </h2>

          <p className="mt-1 font-peyda text-sm leading-6 text-gray-700">
            {isIosOnly
              ? "برای نصب زیست‌آپ، گزینه Share مرورگر را بزن و Add to Home Screen را انتخاب کن."
              : "زیست‌آپ را نصب کن و مثل یک اپلیکیشن مستقل روی دستگاهت بازش کن."}
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!isIosOnly && (
          <Button
            type="button"
            title="نصب زیست‌آپ"
            onClick={install}
            classes="btn btn-primary-green py-3! compact:text-sm! mobile-lg: text-base! laptop:text-lg!"
          />
        )}

        <button
          type="button"
          onClick={dismiss}
          className="
            w-full
            cursor-pointer
            rounded-2xl
            border-2
            border-gray-200
            px-4
            py-2
            font-peyda
            font-bold
            text-darker-blue-200
            transition-colors
            compact:text-sm
            mobile-lg: text-base
            laptop:text-lg
            laptop:hover:bg-gray-75
          "
        >
          {isIosOnly ? "متوجه شدم" : "بعداً"}
        </button>
      </div>
    </aside>
  );
};

export default PwaInstallPrompt;
