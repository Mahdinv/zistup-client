import { AnimatePresence, motion } from "framer-motion";
import { PiCaretRight } from "react-icons/pi";

type PlaygroundFlowHeaderProps = {
  title?: string;
  subTitle?: string;
  onBack?: () => void;
};

const PlaygroundFlowHeader = ({
  title,
  subTitle,
  onBack,
}: PlaygroundFlowHeaderProps) => {
  return (
    <header
      className={`
                flex 
                min-h-27.5 
                w-full 
                shrink-0
                flex-col 
                justify-between
                bg-darker-blue-200
                compact:px-4 
                mobile-lg:px-6
                ${subTitle ? "py-4 gap-2" : "py-3 gap-0"}
             `}
    >
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
      <div className="w-full">
        <h1 className="text-white font-yekan text-3xl font-extrabold">
          {title}
        </h1>
        {subTitle && (
          <label className="text-blue-600 font-peyda font-medium text-sm">
            {subTitle}
          </label>
        )}
      </div>
    </header>
  );
};

export default PlaygroundFlowHeader;
