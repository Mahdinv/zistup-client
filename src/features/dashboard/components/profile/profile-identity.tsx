import { motion, useReducedMotion } from "framer-motion";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import { useUserProfileStore } from "@/shared/stores/user-profile.store";
import { PiUserFill } from "react-icons/pi";

const skeleton = "bg-blue-500/25 dark:bg-blue-700/20 motion-safe:animate-pulse";

export function ProfileAvatar() {
  const user = useUserProfileStore((state) => state.user);
  const src = user?.avatar;
  const reducedMotion = useReducedMotion();
  return (
    <div
      className="relative size-full overflow-hidden rounded-full"
      aria-busy={!user}
    >
      {!user && (
        <span
          aria-label="در حال بارگذاری تصویر پروفایل"
          className={`absolute inset-0 rounded-full ${skeleton}`}
        />
      )}
      <motion.div
        initial={false}
        animate={{ opacity: user ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        className="size-full"
      >
        {src ? (
          <ImageWithSkeleton
            src={src}
            alt="تصویر پروفایل"
            wrapperClassName="size-full rounded-full"
            className="size-full object-cover opacity-100! transition-none!"
          />
        ) : user ? (
          <PiUserFill
            aria-label="تصویر پیش‌فرض کاربر"
            className="size-full translate-y-[10%] scale-110 text-blue-500 dark:text-darker-blue-100"
          />
        ) : null}
      </motion.div>
    </div>
  );
}

export function ProfileName() {
  const user = useUserProfileStore((state) => state.user);
  const reducedMotion = useReducedMotion();
  return (
    <span
      className="relative block min-h-[1.2em] min-w-[5em]"
      aria-busy={!user}
    >
      {!user && (
        <span
          aria-label="در حال بارگذاری نام کاربر"
          className={`absolute inset-x-0 top-[0.2em] mx-auto h-[0.8em] w-[5em] max-w-full rounded-md ${skeleton}`}
        />
      )}
      <motion.span
        initial={false}
        animate={{ opacity: user ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.2 }}
        className="block"
      >
        {user ? user.name?.trim() || "کاربر زیست‌آپ" : "\u00a0"}
      </motion.span>
    </span>
  );
}
