import { motion, useReducedMotion } from "framer-motion";
import { profileLayoutTransition } from "../constants/profile-motion.constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PiCreditCard,
  PiSignOut,
  PiTarget,
  PiUser,
  PiUserList,
} from "react-icons/pi";
import { logout } from "@/features/auth/api/auth.api";
import BaseDrawer from "@/shared/base-components/base-drawer";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import ProfileHero from "../components/profile/profile-hero";
import ProfileItem from "../components/profile/profile-item";
import ProfileAppearance from "../components/profile/profile-appearance";
import { useDashboardTheme } from "../hooks/use-dashboard-theme.hook";

import ProfileBasicInformation from "../components/profile/profile-basic-information";

import ProfileGoalInformation from "../components/profile/profile-goal-information";
type Section = "goal" | "account" | "basic" | "subscription" | "avatar";
const titles: Record<Section, string> = {
  goal: "انتخاب هدف",
  account: "حساب کاربری",
  basic: "اطلاعات پایه",
  subscription: "اشتراک",
  avatar: "ویرایش تصویر پروفایل",
};
const ProfilePage = () => {
  const reducedMotion = useReducedMotion();
  const user = useUserProfileStore((state) => state.user);
  const { theme } = useDashboardTheme();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section | null>(null);
  const details = [
    ["نام", user?.name],
    ["شماره همراه", user?.mobile],
    ["ایمیل", user?.email],
  ];
  return (
    <div dir="rtl" className="flex w-full flex-col gap-6 pb-6 font-peyda">
      <ProfileHero onEditAvatar={() => setSection("avatar")} />
      <motion.div
        data-profile-menu
        initial={reducedMotion ? false : { x: "-110%" }}
        animate={{ x: "0%" }}
        exit={{ x: "-110%" }}
        transition={reducedMotion ? { duration: 0 } : profileLayoutTransition}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <ProfileItem
            title="حساب کاربری"
            subtitle={user?.mobile || "اطلاعات حساب کاربری"}
            icon={PiUser}
            onClick={() => setSection("account")}
          />
          <ProfileItem
            title="اطلاعات پایه"
            subtitle="سن، قد، وزن"
            icon={PiUserList}
            onClick={() => setSection("basic")}
          />
          <ProfileItem
            title="هدف رژیم"
            subtitle="مشاهده و انتخاب رژیم"
            icon={PiTarget}
            onClick={() => setSection("goal")}
          />
          <ProfileItem
            title="اشتراک"
            subtitle="اطلاعات اشتراک در دسترس نیست"
            icon={PiCreditCard}
            onClick={() => setSection("subscription")}
          />
          <ProfileAppearance />
        </div>
        <ProfileItem
          title="خروج از حساب"
          icon={PiSignOut}
          destructive
          onClick={() => {
            logout();
            navigate("/auth/login", { replace: true });
          }}
        />
      </motion.div>
      <ProfileGoalInformation
        open={section === "goal"}
        onOpenChange={(open) => {
          if (!open) setSection(null);
        }}
      />
      <ProfileBasicInformation
        open={section === "basic"}
        onOpenChange={(open) => {
          if (!open) setSection(null);
        }}
      />
      <BaseDrawer
        open={section !== null && section !== "basic" && section !== "goal"}
        onOpenChange={(open) => {
          if (!open) setSection(null);
        }}
        title={section ? titles[section] : "پروفایل"}
        theme={theme}
      >
        {section === "account" ? (
          <dl className="space-y-4">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-wrap justify-between gap-3">
                <dt className="font-bold">{label}</dt>
                <dd
                  dir="auto"
                  className="break-all text-blue-900 dark:text-blue-500"
                >
                  {value || "ثبت نشده"}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-base leading-relaxed">
            {section === "avatar"
              ? "امکان تغییر تصویر پروفایل به‌زودی در دسترس قرار می‌گیرد."
              : "اطلاعات و مدیریت اشتراک هنوز در دسترس نیست."}
          </p>
        )}
      </BaseDrawer>
    </div>
  );
};
export default ProfilePage;
