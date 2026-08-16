import { Outlet, useMatches, useNavigate } from "react-router-dom";
import type {
  PlaygroundFlowHeaderOverride,
  PlaygroundFlowRouteHandle,
} from "./playground-flow-types";
import PlaygroundFlowHeader from "./playground-flow-header";
import { useState } from "react";

const PlaygroundFlowLayout = () => {
  const navigate = useNavigate();
  const matches = useMatches();

  const [headerOverride, setHeaderOverride] =
    useState<PlaygroundFlowHeaderOverride>({});

  const routeHeader =
    [...matches]
      .reverse()
      .map(
        (match) =>
          (match.handle as PlaygroundFlowRouteHandle | undefined)?.header,
      )
      .find(Boolean) ?? {};

  const header = {
    ...routeHeader,
    ...headerOverride,
  };

  const handleBack = () => {
    if (headerOverride.onBack) {
      headerOverride.onBack();
      return;
    }

    if (routeHeader.backTo) {
      navigate(routeHeader.backTo);
    }
  };

  return (
    <div className="compact:w-full tablet:w-3/5 laptop:w-2/5 desktop:w-1/3 mx-auto flex h-dvh flex-col items-center justify-start overflow-hidden bg-darker-blue-200">
      <PlaygroundFlowHeader
        title={header.title}
        subTitle={header.subTitle}
        onBack={
          headerOverride.onBack || routeHeader.backTo ? handleBack : undefined
        }
      />

      <main className="min-h-0 w-full flex-1 overflow-hidden">
        <Outlet context={{ setHeaderOverride }} />
      </main>
    </div>
  );
};

export default PlaygroundFlowLayout;
