import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { PiMicrophone, PiStop } from "react-icons/pi";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import {
  createVoiceRecognition,
  getRecognitionConstructor,
  type VoiceStatus,
} from "@/shared/lib/voice-recognition";

type VoiceBoxProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  appearance?: "default" | "quick-add-meal" | "physical-activity";
  icon?: ReactNode;
};

const errors: Record<string, string> = {
  unsupported:
    "مرورگر شما از جستجوی صوتی پشتیبانی نمی‌کند. لطفاً متن را تایپ کنید.",
  "not-allowed":
    "دسترسی به میکروفون مجاز نیست. مجوز میکروفون را در تنظیمات مرورگر بررسی کنید.",
  "service-not-allowed": "سرویس تشخیص گفتار در این مرورگر در دسترس نیست.",
  "audio-capture": "میکروفون در دسترس نیست. اتصال و تنظیمات آن را بررسی کنید.",
  "no-speech": "صدایی دریافت نشد. دوباره تلاش کنید.",
  network:
    "ارتباط با سرویس تشخیص گفتار برقرار نشد. اتصال اینترنت را بررسی کنید.",
  "language-not-supported": "تشخیص گفتار فارسی در این مرورگر در دسترس نیست.",
};

export default function VoiceBox({
  value,
  onChange,
  disabled = false,
  appearance = "default",
  icon = <PiMicrophone aria-hidden className="size-6" />,
}: VoiceBoxProps) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [controller] = useState(() =>
    createVoiceRecognition({
      onStatus: setStatus,
      onError: (error) =>
        toast.error(
          errors[error] ?? "شروع جستجوی صوتی ممکن نشد. دوباره تلاش کنید.",
        ),
    }),
  );

  useLayoutEffect(() => {
    controller.sync(value, onChange, disabled);
  }, [controller, value, onChange, disabled]);

  useEffect(() => {
    const cancel = () => controller.cancel();
    const visibilityChange = () => {
      if (document.hidden) cancel();
    };
    window.addEventListener("pagehide", cancel);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      window.removeEventListener("pagehide", cancel);
      document.removeEventListener("visibilitychange", visibilityChange);
      controller.dispose();
    };
  }, [controller]);

  const active = status !== "idle";
  const label =
    status === "starting"
      ? "در انتظار میکروفون؛ لغو جستجوی صوتی"
      : status === "stopping"
        ? "در حال پایان جستجوی صوتی"
        : active
          ? "توقف جستجوی صوتی"
          : "شروع جستجوی صوتی";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled || status === "stopping"}
      onClick={() => controller.toggle(getRecognitionConstructor())}
      className={cn(
        "flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-blue-500 bg-blue-300 text-blue-500 dark:border-blue-900 dark:bg-darker-blue-400 focus-visible:outline-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-50",
        appearance === "physical-activity" &&
          "dark:border-darker-blue-100 dark:text-blue-900",
        active &&
          "border-orange-300 text-orange-300 dark:border-orange-300 dark:text-orange-300",
      )}
    >
      {active ? <PiStop aria-hidden className="size-6" /> : icon}
      <span role="status" className="sr-only">
        {active ? label : ""}
      </span>
    </button>
  );
}
