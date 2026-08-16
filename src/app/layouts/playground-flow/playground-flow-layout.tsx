import { Suspense, useCallback, useState } from "react";

import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";

import type {
  PlaygroundFlowHeaderOverride,
  PlaygroundFlowRouteHandle,
} from "./playground-flow-types";

import PlaygroundFlowHeader from "./playground-flow-header";

import AppLoader from "@/shared/base-components/app-loader";

type HeaderOverrideState = {
  pathname: string;

  value: PlaygroundFlowHeaderOverride;
};

const PlaygroundFlowLayout = () => {
  const navigate = useNavigate();

  const matches = useMatches();

  const location = useLocation();

  const [headerOverrideState, setHeaderOverrideState] =
    useState<HeaderOverrideState>({
      pathname: "",

      value: {},
    });

  const setHeaderOverride = useCallback(
    (config: PlaygroundFlowHeaderOverride) => {
      setHeaderOverrideState({
        pathname: location.pathname,

        value: config,
      });
    },
    [location.pathname],
  );

  const headerOverride =
    headerOverrideState.pathname === location.pathname
      ? headerOverrideState.value
      : {};

  const routeHeader =
    [...matches]
      .reverse()
      .map(
        (match) =>
          (match.handle as PlaygroundFlowRouteHandle | undefined)?.header,
      )
      .find(Boolean) ?? {};

  const header = {
    title: headerOverride.title ?? routeHeader.title,

    subTitle: headerOverride.subTitle ?? routeHeader.subTitle,
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
    <div
      className="
        compact:w-full
        tablet:w-3/5
        laptop:w-2/5
        desktop:w-1/3
        mx-auto
        flex
        h-dvh
        flex-col
        items-center
        justify-start
        overflow-hidden
        bg-darker-blue-200
      "
    >
      <PlaygroundFlowHeader
        title={header.title}
        subTitle={header.subTitle}
        onBack={
          headerOverride.onBack || routeHeader.backTo ? handleBack : undefined
        }
      />

      <main
        className="
          min-h-0
          w-full
          flex-1
          overflow-hidden
        "
      >
        <Suspense
          fallback={<AppLoader theme="dark" label="در حال آماده‌سازی..." />}
        >
          <Outlet
            context={{
              setHeaderOverride,
            }}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default PlaygroundFlowLayout;
