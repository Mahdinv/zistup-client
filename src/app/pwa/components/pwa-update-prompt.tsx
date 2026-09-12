import { useCallback, useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import Button from "@/shared/base-components/button";

const UPDATE_INTERVAL = 60 * 60 * 1000;

const PwaUpdatePrompt = () => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW: (_swUrl, currentRegistration) => {
      setRegistration(currentRegistration ?? null);
    },
  });

  const checkForUpdate = useCallback(() => {
    if (!registration) return;
    if (!navigator.onLine) return;
    if (registration.installing) return;

    void registration.update().catch(() => undefined);
  }, [registration]);

  useEffect(() => {
    if (!registration) return;

    checkForUpdate();

    const intervalId = window.setInterval(checkForUpdate, UPDATE_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkForUpdate();
      }
    };

    window.addEventListener("focus", checkForUpdate);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);

      window.removeEventListener("focus", checkForUpdate);
      window.removeEventListener("online", checkForUpdate);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [registration, checkForUpdate]);

  if (!needRefresh) return null;

  const handleUpdate = () => {
    void updateServiceWorker(true);
  };

  const handleLater = () => {
    setNeedRefresh(false);
  };

  return (
    <aside
      aria-label="بروزرسانی زیست‌آپ"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-9999 w-[calc(100%-2rem)] max-w-105 -translate-x-1/2 rounded-2xl bg-white p-4 shadow-2xl"
    >
      <div className="flex items-center gap-3">
        <img src="/pwa/app-icon.svg" alt="" className="h-14 w-14 shrink-0" />

        <div className="min-w-0">
          <h2 className="font-yekan text-xl font-extrabold text-darker-blue-200">
            نسخه جدید زیست‌آپ
          </h2>

          <p className="mt-1 font-peyda text-sm leading-6 text-gray-700">
            نسخه جدید آماده است. برای دریافت آخرین تغییرات، زیست‌آپ را بروزرسانی
            کن.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          type="button"
          title="بروزرسانی"
          onClick={handleUpdate}
          classes="btn btn-primary-green py-3! compact:text-sm! mobile-lg:text-base! laptop:text-lg!"
        />

        <button
          type="button"
          onClick={handleLater}
          className="w-full cursor-pointer rounded-2xl border-2 border-gray-200 px-4 py-2 font-peyda font-bold text-darker-blue-200 transition-colors compact:text-sm mobile-lg:text-base laptop:text-lg laptop:hover:bg-gray-75"
        >
          بعداً
        </button>
      </div>
    </aside>
  );
};

export default PwaUpdatePrompt;
