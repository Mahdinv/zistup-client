import { useCallback, useEffect, useState } from "react";

import type {
  BeforeInstallPromptEvent,
  NavigatorWithStandalone,
  UsePwaInstallResult,
} from "../pwa.types";

const DISMISS_COUNT_KEY = "zistup:pwa-install-dismiss-count";
const NEXT_PROMPT_AT_KEY = "zistup:pwa-install-next-prompt-at";
const IOS_DISMISSED_SESSION_KEY = "zistup:pwa-ios-install-dismissed";

const SHORT_COOLDOWN_DAYS = 3;
const LONG_COOLDOWN_AFTER_DISMISS_COUNT = 3;
const LONG_COOLDOWN_MONTHS = 3;

const isStandaloneMode = () => {
  const displayModeStandalone = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const iosStandalone =
    (navigator as NavigatorWithStandalone).standalone === true;

  return displayModeStandalone || iosStandalone;
};

const isIosDevice = () => {
  const classicIos = /iPad|iPhone|iPod/i.test(navigator.userAgent);

  const modernIpad =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

  return classicIos || modernIpad;
};

const getDismissCount = () => {
  const value = Number(localStorage.getItem(DISMISS_COUNT_KEY) ?? "0");

  return Number.isFinite(value) ? value : 0;
};

const getNextPromptAt = () => {
  const value = Number(localStorage.getItem(NEXT_PROMPT_AT_KEY) ?? "0");

  return Number.isFinite(value) ? value : 0;
};

const isInstallPromptInCooldown = () => {
  return Date.now() < getNextPromptAt();
};

const getNextPromptTimestamp = (dismissCount: number) => {
  const nextDate = new Date();

  if (dismissCount >= LONG_COOLDOWN_AFTER_DISMISS_COUNT) {
    nextDate.setMonth(nextDate.getMonth() + LONG_COOLDOWN_MONTHS);
  } else {
    nextDate.setDate(nextDate.getDate() + SHORT_COOLDOWN_DAYS);
  }

  return nextDate.getTime();
};

const clearInstallPromptPreferences = () => {
  localStorage.removeItem(DISMISS_COUNT_KEY);
  localStorage.removeItem(NEXT_PROMPT_AT_KEY);
};

const usePwaInstall = (): UsePwaInstallResult => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [inCooldown, setInCooldown] = useState(isInstallPromptInCooldown);

  const [installed, setInstalled] = useState(isStandaloneMode);

  const [iosDismissed, setIosDismissed] = useState(
    () => sessionStorage.getItem(IOS_DISMISSED_SESSION_KEY) === "1",
  );

  const isIos = isIosDevice();
  const isIosOnly = isIos && !installPrompt;

  useEffect(() => {
    if (installed) return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstalled(true);
      setInCooldown(false);
      setIosDismissed(false);

      clearInstallPromptPreferences();
      sessionStorage.removeItem(IOS_DISMISSED_SESSION_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [installed]);

  const dismiss = useCallback(() => {
    if (isIosOnly) {
      sessionStorage.setItem(IOS_DISMISSED_SESSION_KEY, "1");
      setIosDismissed(true);

      return;
    }

    const nextDismissCount = getDismissCount() + 1;
    const nextPromptAt = getNextPromptTimestamp(nextDismissCount);

    localStorage.setItem(DISMISS_COUNT_KEY, String(nextDismissCount));
    localStorage.setItem(NEXT_PROMPT_AT_KEY, String(nextPromptAt));

    setInCooldown(true);
  }, [isIosOnly]);

  const install = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    setInstallPrompt(null);

    if (outcome === "dismissed") {
      dismiss();
    }
  }, [dismiss, installPrompt]);

  const shouldShowPrompt =
    !installed &&
    (isIosOnly ? !iosDismissed : Boolean(installPrompt) && !inCooldown);

  return {
    shouldShowPrompt,
    isIosOnly,
    install,
    dismiss,
  };
};

export default usePwaInstall;
