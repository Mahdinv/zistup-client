import { useCallback, useState } from "react";
import { Outlet, useMatches, useNavigate } from "react-router-dom";

import AuthHeader from "../features/authentication/components/auth-header";

import {
  DEFAULT_AUTH_HEADER,
  hasAuthHeaderSetting,
} from "../features/authentication/types/auth-route-handle";

export type AuthOutletContext = {
  setBackHandler: (handler: (() => void) | null) => void;
};

const AuthLayout = () => {
  const matches = useMatches();
  const navigate = useNavigate();

  const [backHandlerState, setBackHandlerState] = useState<(() => void) | null>(
    null,
  );

  const closestHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasAuthHeaderSetting);

  const headerSetting = closestHandle?.authHeader;

  const showHeader = headerSetting !== false;

  const header =
    typeof headerSetting === "object" ? headerSetting : DEFAULT_AUTH_HEADER;

  const setBackHandler = useCallback((handler: (() => void) | null) => {
    setBackHandlerState(() => handler);
  }, []);

  const backTo = header.backTo;

  const handleBack: (() => void) | undefined = backTo
    ? () => navigate(backTo)
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
          context={
            {
              setBackHandler,
            } satisfies AuthOutletContext
          }
        />
      </main>
    </div>
  );
};

export default AuthLayout;
