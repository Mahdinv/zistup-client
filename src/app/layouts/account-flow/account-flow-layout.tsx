import { Suspense, useCallback, useState } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import AccountFlowHeader from "./account-flow-header";
import type { AccountFlowNavigationState } from "./account-flow.types";
import {
  DEFAULT_ACCOUNT_FLOW_HEADER,
  hasAccountFlowHeaderSetting,
} from "./account-flow-route";
import AppLoader from "@/shared/base-components/app-loader";

const AccountFlowLayout = () => {
  const matches = useMatches();
  const navigate = useNavigate();
  const location = useLocation();

  const [backHandlerState, setBackHandlerState] = useState<(() => void) | null>(
    null,
  );

  const closestHandle = [...matches]
    .reverse()
    .map((match) => match.handle)
    .find(hasAccountFlowHeaderSetting);

  const handleHeaderSetting = closestHandle?.accountFlowHeader;

  const navigationState = location.state as AccountFlowNavigationState | null;

  const dynamicHeader = navigationState?.accountFlowHeader;

  const finalHeaderSetting = dynamicHeader ?? handleHeaderSetting;

  const showHeader = finalHeaderSetting !== false;

  const header =
    typeof finalHeaderSetting === "object"
      ? finalHeaderSetting
      : DEFAULT_ACCOUNT_FLOW_HEADER;

  const setBackHandler = useCallback((handler: (() => void) | null) => {
    setBackHandlerState(() => handler);
  }, []);

  const handleBack: (() => void) | undefined = header.backTo
    ? () => navigate(header.backTo!)
    : (backHandlerState ?? undefined);

  return (
    <div className="compact:w-full tablet:w-3/5 laptop:w-2/5 desktop:w-1/3 mx-auto flex h-dvh flex-col items-center justify-start overflow-hidden bg-blue-300">
      {showHeader && (
        <AccountFlowHeader
          firstLineTitle={header.firstLineTitle}
          secondLineTitle={header.secondLineTitle}
          subTitle={header.subTitle}
          imageName={header.imageName}
          onBack={handleBack}
        />
      )}

      <main className="min-h-0 w-full flex-1 overflow-x-hidden">
        <Suspense
          fallback={<AppLoader theme="dark" label="در حال آماده‌سازی..." />}
        >
          <Outlet
            context={{
              setBackHandler,
            }}
          />
        </Suspense>
      </main>
    </div>
  );
};

export default AccountFlowLayout;
