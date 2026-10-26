import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PiCaretRight, PiXCircle } from "react-icons/pi";
import { toast } from "sonner";
import { logout } from "@/features/auth/api/auth.api";
import { normalizeApiError } from "@/shared/api";
import BaseDrawer from "@/shared/base-components/base-drawer";
import Button from "@/shared/base-components/button";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";

export default function ProfileLogoutDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();
  const submitting = useRef(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => navigate("/auth/login", { replace: true }),
    onError: (error) => toast.error(normalizeApiError(error).message),
    onSettled: () => {
      submitting.current = false;
    },
  });
  return (
    <BaseDrawer
      open={open}
      onOpenChange={(next) => {
        if (!submitting.current) onOpenChange(next);
      }}
      title="آیا مطمئن هستی؟"
      theme={theme}
      closeIcon={<PiXCircle size={24} aria-hidden="true" />}
      className="border-0 bg-[#c3e6f3] text-darker-green-200 dark:bg-darker-blue-200 dark:text-gray-200 [--scroll-fade-color:#c3e6f3] dark:[--scroll-fade-color:var(--color-darker-blue-200)] [&>div>header]:pb-4 [&>div>header]:border-blue-500 dark:[&>div>header]:border-darker-blue-100 [&_[data-slot=drawer-close]]:h-8 [&_[data-slot=drawer-close]]:w-6 [&_[data-slot=drawer-close]]:text-blue-900 [&_[data-slot=drawer-swipe-handle]]:h-6 [&_[data-slot=drawer-swipe-handle]]:items-start [&_[data-slot=drawer-swipe-handle]]:pt-[7px] [&_[data-slot=drawer-swipe-handle]]:after:h-[5px] [&_[data-slot=drawer-swipe-handle]]:after:w-[57px] [&_[data-slot=drawer-title]]:text-[20px] [&_[data-slot=drawer-title]]:leading-[1.2] [&_[data-slot=base-drawer-body]]:px-4 [&_[data-slot=base-drawer-body]]:pt-4 [&_[data-slot=base-drawer-body]]:pb-[max(18px,env(safe-area-inset-bottom))]"
    >
      <div
        className="flex flex-row-reverse gap-2 font-peyda"
        aria-busy={isPending}
      >
        <Button
          title={isPending ? "در حال خروج…" : "بله"}
          disable={isPending}
          classes="h-[42px] flex-1 rounded-[20px] bg-red-200 text-black text-[18px]! font-bold shadow-[0_4px_4px_rgba(0,0,0,0.04)] disabled:cursor-wait disabled:opacity-60"
          onClick={() => {
            if (submitting.current) return;
            submitting.current = true;
            mutate();
          }}
        />
        <Button
          title="بازگشت"
          icon={<PiCaretRight size={20} aria-hidden="true" />}
          iconFirst
          itemsGap={2}
          disable={isPending}
          classes="h-[42px] flex-1 rounded-[20px] border border-blue-500 bg-blue-300 text-blue-700 text-[18px]! font-bold shadow-[0_4px_4px_rgba(0,0,0,0.04)] dark:border-transparent dark:bg-darker-blue-400 dark:shadow-none disabled:opacity-60"
          onClick={() => onOpenChange(false)}
        />
      </div>
    </BaseDrawer>
  );
}
