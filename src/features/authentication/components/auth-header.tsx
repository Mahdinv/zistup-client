import { AnimatePresence, motion } from "framer-motion";

import { PiCaretRight } from "react-icons/pi";

type AuthHeaderProps = {
  firstLineTitle: string;
  secondLineTitle?: string;
  subTitle?: string;
  imageName?: string;
  onBack?: () => void;
};

const AuthHeader = ({
  firstLineTitle,
  secondLineTitle,
  subTitle,
  imageName,
  onBack,
}: AuthHeaderProps) => {
  const titleKey = [firstLineTitle, secondLineTitle, subTitle]
    .filter(Boolean)
    .join("-");

  return (
    <header className="relative flex h-[clamp(160px,27dvh,300px)] w-full shrink-0 select-none flex-col justify-around bg-blue-300 compact:px-4 mobile-lg:px-6">
      <div className="h-9 self-start">
        <AnimatePresence initial={false}>
          {onBack && (
            <motion.button
              key="auth-back-button"
              type="button"
              aria-label="بازگشت به مرحله قبل"
              onClick={onBack}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
              }}
              whileTap={{
                scale: 0.92,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="rounded-sm border border-blue-600 p-1.5 text-blue-600 outline-none transition-colors hover:bg-blue-600/10 focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <PiCaretRight className="text-xl" aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={titleKey}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -8,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="space-y-1.5 text-right"
        >
          <h1 className="font-yekan text-8xl font-extrabold space-y-1">
            <span className="block">{firstLineTitle}</span>

            {secondLineTitle && (
              <span className="block">
                {secondLineTitle}
                {subTitle && (
                  <span className="text-4xl mr-1">({subTitle})</span>
                )}
              </span>
            )}
          </h1>
        </motion.div>
      </AnimatePresence>

      {imageName && (
        <motion.img
          key={imageName}
          src={imageName}
          alt=""
          aria-hidden="true"
          loading="lazy"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.25,
            ease: "easeOut",
          }}
          className="pointer-events-none absolute h-auto -translate-y-1/2 compact:left-[4%] compact:top-2/5 compact:w-[50%] mobile:w-[50%] mobile-lg:top-1/2 mobile-lg:w-[45%] fold:left-[8%] fold:w-[35%] tablet:w-[45%] desktop:w-2/5"
        />
      )}
    </header>
  );
};

export default AuthHeader;
