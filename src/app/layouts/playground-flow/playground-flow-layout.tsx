import { Suspense, useCallback, useEffect, useState } from "react";
import { getPlaygroundFlowOrigin } from "./playground-flow-navigation";

import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";

import type { PlaygroundFlowHeaderOverride } from "./playground-flow-types";

import { hasPlaygroundFlowHeaderSetting } from "./playground-flow-route";

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
  const [entryOrigin] = useState(
    () => getPlaygroundFlowOrigin(location.state) ?? "/onboarding/choose-plan",
  );
  const origin = getPlaygroundFlowOrigin(location.state) ?? entryOrigin;
  const [entryReturnState] = useState(() => location.state?.returnState);
  const returnState = location.state?.returnState ?? entryReturnState;

  // Carry the entry route through steps and roadmap returns, including reloads.
  useEffect(() => {
    if (getPlaygroundFlowOrigin(location.state)) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: location.hash },
      {
        replace: true,
        preventScrollReset: true,
        state: { ...location.state, origin, returnState },
      },
    );
  }, [location, navigate, origin, returnState]);

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

  const closestHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasPlaygroundFlowHeaderSetting);

  const routeHeaderSetting = closestHandle?.header;

  const showHeader = routeHeaderSetting !== false;

  const routeHeader =
    typeof routeHeaderSetting === "object" ? routeHeaderSetting : {};

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
      const returningToOrigin =
        location.pathname.replace(/\/+$/, "") === "/game-workflow";
      navigate(
        returningToOrigin ? origin : routeHeader.backTo,
        { state: returningToOrigin ? returnState : { origin, returnState } },
      );
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
      {showHeader && (
        <PlaygroundFlowHeader
          title={header.title}
          subTitle={header.subTitle}
          onBack={
            headerOverride.onBack || routeHeader.backTo ? handleBack : undefined
          }
        />
      )}

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
