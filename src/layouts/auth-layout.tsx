import { useCallback, useState } from "react";
import AuthHeader from "../features/authentication/components/auth-header";
import { Outlet, useMatches } from "react-router-dom";

export type AuthOutletContext = {
  setBackHandler: (handler: (() => void) | null) => void;
};

const AuthLayout = () => {
  const match = useMatches();
  const data = match.at(-1)?.handle as {
    firstLineTitle: string;
    secondLineTitle?: string;
    subTitle?: string;
    imageName?: string;
  };

  const [backHandlerState, setBackHandlerState] = useState<(() => void) | null>(
    null,
  );

  const setBackHandler = useCallback((handler: (() => void) | null) => {
    setBackHandlerState(() => handler);
  }, []);

  return (
    <div className="compact:w-full tablet:w-3/5 laptop:w-2/5 desktop:w-1/3 mx-auto flex flex-col justify-start items-center h-dvh bg-blue-300 overflow-hidden">
      <AuthHeader
        firstLineTitle={data.firstLineTitle}
        secondLineTitle={data.secondLineTitle}
        subTitle={data.subTitle}
        imageName={data.imageName}
        onBack={backHandlerState ?? undefined}
      />
      <div className="w-full min-h-0 flex-1 overflow-x-hidden">
        <Outlet context={{ setBackHandler }} />
      </div>
    </div>
  );
};

export default AuthLayout;
