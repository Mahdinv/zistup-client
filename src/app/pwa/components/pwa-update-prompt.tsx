import { useCallback, useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import Button from "@/shared/base-components/button";

const UPDATE_INTERVAL = 60 * 60 * 1000;
const MIN_UPDATE_CHECK_INTERVAL = 60 * 1000;
const ACTIVATION_TIMEOUT = 10 * 1000;

const DISMISSED_UPDATE_VERSION_KEY = "zistup:pwa-dismissed-update-version";

type VersionInfo = {
  version: string;
};

const compareVersions = (versionA: string, versionB: string) => {
  const normalize = (version: string) =>
    version
      .split("-")[0]
      .split(".")
      .map((part) => Number.parseInt(part, 10) || 0);

  const a = normalize(versionA);
  const b = normalize(versionB);

  const length = Math.max(a.length, b.length);

  for (let i = 0; i < length; i += 1) {
    const aPart = a[i] ?? 0;
    const bPart = b[i] ?? 0;

    if (aPart > bPart) {
      return 1;
    }

    if (aPart < bPart) {
      return -1;
    }
  }

  return 0;
};

const isNewerVersion = (latestVersion: string, currentVersion: string) =>
  compareVersions(latestVersion, currentVersion) > 0;

const fetchLatestAppVersion = async (): Promise<string | null> => {
  try {
    const response = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "cache-control": "no-cache",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<VersionInfo>;

    if (typeof data.version !== "string") {
      return null;
    }

    return data.version.trim();
  } catch {
    return null;
  }
};

const waitForWorkerActivation = (worker: ServiceWorker): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (worker.state === "activated") {
      resolve();
      return;
    }

    const handleStateChange = () => {
      if (worker.state === "activated") {
        cleanup();
        resolve();
        return;
      }

      if (worker.state === "redundant") {
        cleanup();

        reject(new Error("Service worker became redundant before activation."));
      }
    };

    const cleanup = () => {
      worker.removeEventListener("statechange", handleStateChange);

      window.clearTimeout(timeoutId);
    };

    worker.addEventListener("statechange", handleStateChange);

    const timeoutId = window.setTimeout(() => {
      cleanup();

      reject(new Error("Service worker activation timed out."));
    }, ACTIVATION_TIMEOUT);
  });
};

const PwaUpdatePrompt = () => {
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  const [serviceWorkerUrl, setServiceWorkerUrl] = useState<string | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);

  const [availableVersion, setAvailableVersion] = useState<string | null>(null);

  const lastUpdateCheckRef = useRef(0);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,

    /*
     * Reload را خودمان بعد از activation انجام می‌دهیم.
     * نمی‌خواهیم Workbox قبل از اطمینان از فعال شدن worker
     * صفحه را reload کند.
     */
    onNeedReload: () => undefined,

    onRegisteredSW: (swUrl, currentRegistration) => {
      setServiceWorkerUrl(swUrl);

      setRegistration(currentRegistration ?? null);

      /*
       * خود register شدن SW یک update check انجام می‌دهد.
       * پس بلافاصله دوباره registration.update() نمی‌زنیم.
       */
      lastUpdateCheckRef.current = Date.now();
    },
  });

  useEffect(() => {
    if (!needRefresh) {
      return;
    }

    let cancelled = false;

    const validateUpdate = async () => {
      const latestVersion = await fetchLatestAppVersion();

      if (cancelled) {
        return;
      }

      /*
       * تا وقتی نسخه سرور مشخص نشده،
       * هیچ پیغام بروزرسانی نشان نمی‌دهیم.
       */
      if (!latestVersion) {
        setAvailableVersion(null);
        return;
      }

      /*
       * اگر نسخه سرور جدیدتر از نسخه فعلی نیست،
       * این waiting worker یک "نسخه جدید" محسوب نمی‌شود.
       */
      if (!isNewerVersion(latestVersion, __APP_VERSION__)) {
        setAvailableVersion(null);
        setNeedRefresh(false);

        /*
         * اگر یک worker با همین version به دلیل redeploy/build
         * در حالت waiting مانده، بدون نمایش پیغام فعالش می‌کنیم.
         */
        const currentRegistration =
          registration ?? (await navigator.serviceWorker.getRegistration());

        if (currentRegistration?.waiting) {
          try {
            await updateServiceWorker();
          } catch {
            // Silent update failure should not affect the app.
          }
        }

        return;
      }

      /*
       * اگر کاربر قبلاً برای همین نسخه "بعداً" زده،
       * دوباره مزاحمش نمی‌شویم.
       */
      const dismissedVersion = window.localStorage.getItem(
        DISMISSED_UPDATE_VERSION_KEY,
      );

      if (dismissedVersion === latestVersion) {
        setAvailableVersion(null);
        setNeedRefresh(false);
        return;
      }

      /*
       * فقط اینجا واقعاً اجازه نمایش popup را می‌دهیم.
       */
      setAvailableVersion(latestVersion);
    };

    void validateUpdate();

    return () => {
      cancelled = true;
    };
  }, [needRefresh, registration, setNeedRefresh, updateServiceWorker]);

  const checkForUpdate = useCallback(async () => {
    if (!registration || !serviceWorkerUrl) {
      return;
    }

    if (!navigator.onLine) {
      return;
    }

    /*
     * اگر همین الان install/update در جریان است
     * یا worker جدید از قبل waiting است،
     * check دیگری انجام نمی‌دهیم.
     */
    if (registration.installing || registration.waiting) {
      return;
    }

    const now = Date.now();

    /*
     * focus + visibilitychange + online ممکن است پشت سر هم
     * fire شوند. Workbox برای update checkهای خیلی نزدیک
     * به هم رفتار heuristic دارد.
     */
    if (now - lastUpdateCheckRef.current < MIN_UPDATE_CHECK_INTERVAL) {
      return;
    }

    lastUpdateCheckRef.current = now;

    try {
      const latestVersion = await fetchLatestAppVersion();

      if (!latestVersion) {
        return;
      }

      if (!isNewerVersion(latestVersion, __APP_VERSION__)) {
        return;
      }

      const response = await fetch(serviceWorkerUrl, {
        cache: "no-store",
        headers: {
          "cache-control": "no-cache",
        },
      });

      if (!response.ok) {
        return;
      }

      await registration.update();
    } catch {
      // Update check failure should not affect the app.
    }
  }, [registration, serviceWorkerUrl]);

  useEffect(() => {
    if (!registration) {
      return;
    }

    /*
     * اینجا عمداً checkForUpdate() را فوراً اجرا نمی‌کنیم.
     * registration اولیه خودش update check انجام داده است.
     */

    const intervalId = window.setInterval(() => {
      void checkForUpdate();
    }, UPDATE_INTERVAL);

    const handleFocus = () => {
      void checkForUpdate();
    };

    const handleOnline = () => {
      void checkForUpdate();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkForUpdate();
      }
    };

    window.addEventListener("focus", handleFocus);

    window.addEventListener("online", handleOnline);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);

      window.removeEventListener("focus", handleFocus);

      window.removeEventListener("online", handleOnline);

      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [registration, checkForUpdate]);

  const handleUpdate = async () => {
    if (isUpdating) {
      return;
    }

    /*
     * registration داخل state معمولاً همان object فعلی است،
     * ولی برای اطمینان registration واقعی browser را هم می‌گیریم.
     */
    const currentRegistration =
      registration ?? (await navigator.serviceWorker.getRegistration());

    const waitingWorker = currentRegistration?.waiting;

    if (!waitingWorker) {
      setNeedRefresh(false);
      return;
    }

    setIsUpdating(true);

    try {
      /*
       * Listener را قبل از ارسال SKIP_WAITING می‌سازیم
       * تا statechange را از دست ندهیم.
       */
      const activationPromise = waitForWorkerActivation(waitingWorker);

      /*
       * vite-plugin-pwa به waiting worker پیام
       * SKIP_WAITING ارسال می‌کند.
       */
      await updateServiceWorker();

      /*
       * مهم‌ترین قسمت:
       * تا زمانی که worker واقعاً activated نشده،
       * صفحه reload نمی‌شود.
       */
      await activationPromise;

      setNeedRefresh(false);

      if (availableVersion) {
        window.localStorage.removeItem(DISMISSED_UPDATE_VERSION_KEY);
      }

      setAvailableVersion(null);

      /*
       * حالا reload کاملاً safe است و worker جدید active است.
       */
      window.location.reload();
    } catch (error) {
      console.error("Failed to activate the new service worker:", error);

      setIsUpdating(false);
    }
  };

  const handleLater = () => {
    setAvailableVersion(null);
    setNeedRefresh(false);
  };

  const hasWaitingUpdate = Boolean(registration?.waiting);

  if (!needRefresh || !hasWaitingUpdate || !availableVersion) {
    return null;
  }

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
          title={isUpdating ? "در حال بروزرسانی..." : "بروزرسانی"}
          onClick={() => {
            void handleUpdate();
          }}
          classes="btn btn-primary-green py-3! compact:text-sm! mobile-lg:text-base! laptop:text-lg!"
          disable={isUpdating}
        />

        <button
          type="button"
          onClick={handleLater}
          disabled={isUpdating}
          className="w-full cursor-pointer rounded-2xl border-2 border-gray-200 px-4 py-2 font-peyda font-bold text-darker-blue-200 transition-colors disabled:cursor-not-allowed disabled:opacity-50 compact:text-sm mobile-lg:text-base laptop:text-lg laptop:hover:bg-gray-75"
        >
          بعداً
        </button>
      </div>
    </aside>
  );
};

export default PwaUpdatePrompt;
