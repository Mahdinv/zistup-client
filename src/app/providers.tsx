import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Toaster } from "sonner";
import { queryClient } from "../shared/api";
import PwaInstallPrompt from "@/app/pwa/components/pwa-install-prompt";
import PwaUpdatePrompt from "@/app/pwa/components/pwa-update-prompt";
import "react-loading-skeleton/dist/skeleton.css";
import { RxCrossCircled } from "react-icons/rx";
import { PiCheckCircle } from "react-icons/pi";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        {children}
      </SkeletonTheme>

      <Toaster
        position="top-center"
        icons={{
          success: <PiCheckCircle className="text-7xl" color="#2ce57f" />,
          error: <RxCrossCircled className="text-7xl" color="#D23A3A" />,
        }}
        toastOptions={{
          style: {
            background: "#1B1A20",
            color: "#FFEFEF",
            borderRadius: "8px",
            fontFamily: '"Peyda", ui-sans-serif, system-ui, sans-serif',
          },

          classNames: {
            toast: "compact:h-12.5! fold:h-13! laptop:h-14! !gap-2",
            icon: "!w-8 !h-8 !shrink-0",
            success: "!border-[0.5px] !border-[#2ce57f]",
            error: "!border-[0.5px] !border-[#D23A3A]",
          },
        }}
      />

      <PwaInstallPrompt />
      <PwaUpdatePrompt />
    </QueryClientProvider>
  );
};

export default Providers;
