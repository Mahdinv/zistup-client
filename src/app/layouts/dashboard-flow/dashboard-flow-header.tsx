import { IoNotificationsOutline } from "react-icons/io5";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ProfileAvatar,
  ProfileName,
} from "@/features/dashboard/components/profile/profile-identity";
import { profileLayoutTransition } from "@/features/dashboard/constants/profile-motion.constants";

const detailVariants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0 },
};

const DashboardFlowHeader = () => {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? { duration: 0 } : profileLayoutTransition;
  return (
    <header className="relative isolate w-full min-h-12 border-b border-transparent compact:px-4 fold:px-6 py-3 flex flex-row justify-between items-center">
      <motion.div
        layoutCrossfade={false}
        layoutId="profile-surface"
        data-profile-element="surface"
        animate={{ opacity: 1 }}
        transition={transition}
        aria-hidden="true"
        style={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        className="pointer-events-none absolute inset-0 -z-10 bg-blue-100 dark:bg-darker-blue-400 border-b border-gray-300 dark:border-darker-blue-100 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.04)]"
      />
      <motion.div
        variants={detailVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
      >
        <IoNotificationsOutline className="text-blue-600 hover:text-blue-500 active:text-blue-500 compact:text-4xl fold:text-5xl laptop:text-6xl cursor-pointer" />
      </motion.div>
      <div className="flex-1 justify-end flex flex-row items-center gap-1.5">
        <div className="flex flex-col justify-center items-center gap-1">
          <motion.h1
            layout="position"
            layoutCrossfade={false}
            layoutId="profile-name"
            data-profile-element="name"
            animate={{ opacity: 1 }}
            transition={transition}
            className="w-full text-center font-yekan font-extrabold leading-[120%] compact:text-xl fold:text-2xl laptop:text-3xl text-black dark:text-white"
          >
            <ProfileName />
          </motion.h1>
          <motion.small
            variants={detailVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
            className="font-peyda font-medium leading-[150%] compact:text-xs fold:text-sm laptop:text-base text-blue-700"
          >
            سطح دو : محافظ زمین
          </motion.small>
        </div>
        <Link
          to="/app/profile"
          aria-label="مشاهده پروفایل"
          className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
        >
          <motion.div
            layoutCrossfade={false}
            layoutId="profile-avatar"
            data-profile-element="avatar"
            transition={transition}
            style={{ borderRadius: 9999 }}
            className="compact:size-12 fold:size-13 laptop:size-14 border border-blue-500"
          >
            <ProfileAvatar />
          </motion.div>
        </Link>
      </div>
    </header>
  );
};
export default DashboardFlowHeader;
