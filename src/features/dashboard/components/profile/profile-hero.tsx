import { motion, useReducedMotion } from "framer-motion";
import { profileLayoutTransition } from "../../constants/profile-motion.constants";
import { PiPencilSimple } from "react-icons/pi";
import { ProfileAvatar, ProfileName } from "./profile-identity";

export default function ProfileHero({
  onEditAvatar,
}: {
  onEditAvatar: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : profileLayoutTransition;
  return (
    <section
      aria-label="پروفایل کاربر"
      className="relative isolate flex min-h-[176px] items-center justify-center border border-transparent px-5 py-5"
    >
      <motion.div
        layoutCrossfade={false}
        layoutId="profile-surface"
        data-profile-element="surface"
        transition={transition}
        aria-hidden="true"
        style={{
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
        className="pointer-events-none absolute -inset-px -z-10 border border-transparent bg-blue-200 shadow-[0_4px_4px_rgba(0,0,0,0.04)] dark:border-darker-blue-100 dark:bg-[linear-gradient(163.55deg,#0D0E12_-87.8%,#75D5F6_1285.98%)]"
      />
      <div
        dir="ltr"
        className="flex w-full items-start justify-center gap-10.5"
      >
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3">
          <div className="relative size-25 shrink-0">
            <motion.div
              layoutCrossfade={false}
              layoutId="profile-avatar"
              data-profile-element="avatar"
              transition={transition}
              style={{ borderRadius: 9999 }}
              className="relative size-full border-[2.5px] border-blue-500 bg-darker-blue-300"
            >
              <ProfileAvatar />
              <button
                type="button"
                onClick={onEditAvatar}
                aria-label="ویرایش تصویر پروفایل"
                className="absolute right-[-2.5px] top-[66.5px] flex size-6 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-darker-blue-400 shadow-[0_4px_4px_rgba(0,0,0,0.04)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <PiPencilSimple size={15} aria-hidden="true" />
              </button>
            </motion.div>
          </div>
          <motion.h1
            layout="position"
            layoutCrossfade={false}
            layoutId="profile-name"
            data-profile-element="name"
            transition={transition}
            dir="rtl"
            className="w-full wrap-break-word text-center font-yekan text-2xl font-extrabold leading-[1.2] text-darker-green-200 dark:text-white"
          >
            <ProfileName />
          </motion.h1>
        </div>
        <motion.div
          initial={reducedMotion ? false : { y: -40, scale: 0.35, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -40, scale: 0.35, opacity: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }
          }
          className="flex min-w-0 flex-1 flex-col items-center gap-3"
          dir="rtl"
        >
          {/* The profile contract does not expose level/XP yet; never display mock progress. */}
          <div
            aria-label="اطلاعات سطح در دسترس نیست"
            className="flex size-[100px] shrink-0 flex-col items-center justify-center rounded-full border-[8px] border-blue-300 text-lg font-bold text-darker-green-200 dark:border-darker-blue-500 dark:text-white"
          >
            <span>سطح</span>
            <span aria-hidden="true">—</span>
          </div>
          <p
            dir="ltr"
            className="text-center font-rokh text-2xl leading-[1.2] text-blue-700"
          >
            — / —{" "}
            <span className="font-peyda text-base text-green-500 dark:text-green-400">
              XP
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
