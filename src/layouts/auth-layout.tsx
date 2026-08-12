import { useCallback, useState } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";

import AuthHeader from "../features/authentication/components/auth-header";

import {
  DEFAULT_AUTH_HEADER,
  hasAuthHeaderSetting,
} from "../features/authentication/types/auth-route-handle";
import type { AuthNavigationState } from "../features/authentication/types/auth-navigation-state";

export type AuthOutletContext = {
  setBackHandler: (handler: (() => void) | null) => void;
};

const AuthLayout = () => {
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();

  const [backHandlerState, setBackHandlerState] = useState<(() => void) | null>(
    null,
  );

  const closestHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasAuthHeaderSetting);

  const handleHeaderSetting = closestHandle?.authHeader;

  const navigationState = location.state as AuthNavigationState | null;

  const dynamicHeader = navigationState?.authHeader;

  const finalHeaderSetting = dynamicHeader ?? handleHeaderSetting;

  const showHeader = finalHeaderSetting !== false;

  const header =
    typeof finalHeaderSetting === "object"
      ? finalHeaderSetting
      : DEFAULT_AUTH_HEADER;

  const setBackHandler = useCallback((handler: (() => void) | null) => {
    setBackHandlerState(() => handler);
  }, []);

  const handleBack: (() => void) | undefined = header.backTo
    ? () => navigate(header.backTo!)
    : (backHandlerState ?? undefined);

  return (
    <div className="compact:w-full tablet:w-3/5 laptop:w-2/5 desktop:w-1/3 mx-auto flex h-dvh flex-col items-center justify-start overflow-hidden bg-blue-300">
      {showHeader && (
        <AuthHeader
          firstLineTitle={header.firstLineTitle}
          secondLineTitle={header.secondLineTitle}
          subTitle={header.subTitle}
          imageName={header.imageName}
          onBack={handleBack}
        />
      )}

      <main className="min-h-0 w-full flex-1 overflow-x-hidden">
        <Outlet
          context={{
            setBackHandler,
          }}
        />
      </main>
    </div>
  );
};

export default AuthLayout;
