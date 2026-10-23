import { PiCircleHalf, PiMoon, PiSun } from "react-icons/pi";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";
import ProfileItem from "./profile-item";
import { cn } from "@/shared/lib/utils";

export default function ProfileAppearance() {
  const { theme, toggleTheme } = useDashboardTheme();
  return (
    <ProfileItem
      title="ظاهر برنامه"
      subtitle="انتخاب تم محیط برنامه"
      icon={PiCircleHalf}
    >
      <div
        role="group"
        aria-label="ظاهر برنامه"
        dir="ltr"
        className="flex h-8 w-[113px] shrink-0 items-center rounded-[10px] bg-blue-200 p-[3px] dark:bg-darker-blue-500"
      >
        {(
          [
            { value: "light", label: "روشن", icon: PiSun },
            { value: "dark", label: "تاریک", icon: PiMoon },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={theme === value}
            onClick={() => {
              if (theme !== value) toggleTheme();
            }}
            className={cn(
              "flex h-[26px] flex-1 cursor-pointer items-center justify-center gap-[3px] rounded-[6px] text-xs font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800",
              theme === value
                ? "bg-green-500 text-darker-green-200"
                : "text-blue-800",
            )}
          >
            <span>{label}</span>
            <Icon size={12} aria-hidden="true" />
          </button>
        ))}
      </div>
    </ProfileItem>
  );
}
