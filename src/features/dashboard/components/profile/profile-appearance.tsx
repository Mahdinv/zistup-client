import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineMoon, HiSun } from "react-icons/hi";
import { PiCircleHalf } from "react-icons/pi";
import { useDashboardTheme } from "../../hooks/use-dashboard-theme.hook";
import ProfileItem from "./profile-item";

export default function ProfileAppearance() {
  const { theme, toggleTheme } = useDashboardTheme();
  const reducedMotion = useReducedMotion();
  const dark = theme === "dark";
  const transition = { duration: reducedMotion ? 0 : 0.25 };
  return (
    <ProfileItem
      title="ظاهر برنامه"
      subtitle="انتخاب تم محیط برنامه"
      icon={PiCircleHalf}
      className="gap-2 pl-4 pr-2.75 [&>span:nth-child(2)]:gap-1 [&>span:nth-child(2)]:mr-1 dark:shadow-none"
    >
      <motion.button
        type="button"
        role="switch"
        aria-label="حالت تاریک"
        aria-checked={dark}
        onClick={toggleTheme}
        dir="ltr"
        initial={false}
        animate={{
          backgroundColor: dark
            ? "var(--color-darker-blue-500)"
            : "var(--color-blue-100)",
        }}
        transition={transition}
        className="relative h-9 w-22.25 shrink-0 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400"
      >
        <motion.span
          initial={false}
          animate={{
            x: dark ? 0 : 38,
            color: dark
              ? "var(--color-white)"
              : "var(--color-darker-green-200)",
          }}
          transition={transition}
          className="absolute left-1 top-0 flex h-full w-10.75 items-center justify-center font-peyda text-[14.68px] font-bold leading-[1.4]"
        >
          <motion.span
            initial={false}
            animate={{ opacity: dark ? 1 : 0 }}
            transition={transition}
            className="absolute pt-1"
            aria-hidden="true"
          >
            تاریک
          </motion.span>
          <motion.span
            initial={false}
            animate={{ opacity: dark ? 0 : 1 }}
            transition={transition}
            className="absolute pt-1"
            aria-hidden="true"
          >
            روشن
          </motion.span>
        </motion.span>
        <motion.span
          initial={false}
          animate={{
            x: dark ? 51 : 0,
            backgroundColor: dark
              ? "var(--color-green-500)"
              : "var(--color-blue-400)",
          }}
          transition={transition}
          className="absolute left-1 top-0.75 flex size-7.5 items-center justify-center rounded-full text-darker-green-200"
        >
          <motion.span
            initial={false}
            animate={{
              opacity: dark ? 1 : 0,
              rotate: dark ? 0 : -60,
              scale: dark ? 1 : 0.5,
            }}
            transition={transition}
            className="absolute"
          >
            <HiOutlineMoon size={20} aria-hidden="true" />
          </motion.span>
          <motion.span
            initial={false}
            animate={{
              opacity: dark ? 0 : 1,
              rotate: dark ? 60 : 0,
              scale: dark ? 0.5 : 1,
            }}
            transition={transition}
            className="absolute"
          >
            <HiSun size={20} aria-hidden="true" />
          </motion.span>
        </motion.span>
      </motion.button>
    </ProfileItem>
  );
}
