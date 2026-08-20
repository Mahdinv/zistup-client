import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { Toaster } from "sonner";
import { queryClient } from "../shared/api";
import PwaInstallPrompt from "@/app/pwa/components/pwa-install-prompt";
import PwaUpdatePrompt from "@/app/pwa/components/pwa-update-prompt";
import "react-loading-skeleton/dist/skeleton.css";

type ProvidersProps = {
  children: ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        {children}
      </SkeletonTheme>

      <Toaster position="top-center" richColors />

      <PwaInstallPrompt />
      <PwaUpdatePrompt />
    </QueryClientProvider>
  );
};

export default Providers;
