import type { ReactNode } from "react";

const PlaygroundFlowContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full min-h-0 w-full max-w-full compact:px-4 mobile-lg:px-6 pb-[calc(1.75rem+env(safe-area-inset-bottom))]">
      {children}
    </div>
  );
};

export default PlaygroundFlowContainer;
