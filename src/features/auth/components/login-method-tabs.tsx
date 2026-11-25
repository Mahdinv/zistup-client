import { useRef, useState } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { Tabs } from "@base-ui/react/tabs";
import PhoneLoginForm from "./phone-login-form";
import UsernameLoginForm from "./username-login-form";
import type { AuthIdentifierDTO } from "../api/auth.types";
import "./login-method-tabs.css";

type LoginMethodTabsProps = {
  onSuccess: (identifier: AuthIdentifierDTO, refCode?: string) => void;
};

const LoginMethodTabs = ({ onSuccess }: LoginMethodTabsProps) => {
  const [method, setMethod] = useState("mobile");
  const mobileTabRef = useRef<HTMLButtonElement>(null);

  // Registration and passwordless access already share the existing OTP flow.
  const openMobileLogin = () => {
    setMethod("mobile");
    mobileTabRef.current?.focus();
  };

  return (
    <DirectionProvider direction="rtl">
      <Tabs.Root
        value={method}
        onValueChange={setMethod}
        className="login-method-tabs flex min-h-0 w-full flex-1 flex-col gap-8"
      >
        <Tabs.List
          aria-label="روش ورود"
          activateOnFocus
          className="grid shrink-0 grid-cols-2 gap-1 rounded-2xl border border-dark bg-darker-blue-300 px-1.5 py-1.25 shadow-sm"
        >
          <Tabs.Tab
            ref={mobileTabRef}
            value="mobile"
            className="min-h-9 cursor-pointer rounded-[10px] px-2 py-1 font-yekan text-lg font-extrabold text-white transition-colors data-active:bg-dark motion-reduce:transition-none"
          >
            شماره موبایل
          </Tabs.Tab>
          <Tabs.Tab
            value="username"
            className="min-h-9 cursor-pointer rounded-[10px] px-2 py-1 font-yekan text-lg font-extrabold text-white transition-colors data-active:bg-dark motion-reduce:transition-none"
          >
            نام کاربری
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel
          id="mobile-login-panel"
          value="mobile"
          keepMounted
          className="flex flex-1 flex-col data-hidden:hidden"
        >
          <PhoneLoginForm onSuccess={onSuccess} />
        </Tabs.Panel>

        <Tabs.Panel
          value="username"
          keepMounted
          className="flex flex-1 flex-col data-hidden:hidden"
        >
          <UsernameLoginForm onPhoneLogin={openMobileLogin} />
        </Tabs.Panel>
      </Tabs.Root>
    </DirectionProvider>
  );
};

export default LoginMethodTabs;
