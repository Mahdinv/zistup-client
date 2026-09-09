import { addTablemates } from "@/features/game-workflow/api/tablemates.api";
import { normalizeApiError } from "@/shared/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const shouldReduceMotion = useReducedMotion();
  const { pathname } = useLocation();

  const { mutate, isPending } = useMutation({
    mutationFn: addTablemates,
    onSuccess: async () => {
      toast.info("شما مرحله همسفره را رد کردید");
      queryClient.invalidateQueries({ queryKey: ["roadMapList"] });
      navigate("/game-workflow");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const showSkipButton =
    pathname.replace(/\/+$/, "") === "/game-workflow/tablemates";

  const transition = {
    duration: shouldReduceMotion ? 0.1 : 0.28,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  const handleSkip = () => {
    if (isPending) return;

    mutate({
      tablemates: [],
    });
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.2,
        ease: "easeOut",
      }}
      className="min-h-28 h-auto w-full shrink-0 bg-darker-blue-200 compact:px-4 mobile-lg:px-6 pt-2 pb-2"
    >
      <div className="relative flex min-h-14 w-full items-center justify-center">
        <AnimatePresence initial={false}>
          {onBack && (
            <motion.button
              key="playground-back"
              type="button"
              aria-label="بازگشت به مرحله قبل"
              onClick={onBack}
              initial={{
                opacity: 0,
                x: shouldReduceMotion ? 0 : -16,
                scale: shouldReduceMotion ? 1 : 0.9,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: shouldReduceMotion ? 0 : -10,
                scale: shouldReduceMotion ? 1 : 0.92,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: 4,
                      scale: 1.05,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: 6,
                      scale: 0.92,
                    }
              }
              transition={transition}
              className="absolute inset-s-0 flex cursor-pointer items-center justify-center text-blue-600 outline-none"
            >
              <PiCaretRight
                className="compact:text-5xl fold:text-6xl laptop:text-7xl"
                aria-hidden="true"
              />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          className={`flex min-w-0 items-center justify-center ${
            showSkipButton
              ? "compact:max-w-[55%] mobile-lg:max-w-[65%] tablet:max-w-[75%]"
              : "compact:max-w-[80%] mobile-lg:max-w-[85%] tablet:max-w-[90%]"
          }`}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {title && (
              <motion.h1
                key={title}
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 10,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : -8,
                  scale: shouldReduceMotion ? 1 : 0.98,
                }}
                transition={transition}
                className="text-center font-yekan compact:text-2xl fold:text-3xl laptop:text-4xl font-extrabold leading-tight text-white"
              >
                {title}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {showSkipButton && (
            <motion.button
              key="playground-skip"
              type="button"
              aria-label="رد کردن مرحله"
              onClick={handleSkip}
              initial={{
                opacity: 0,
                x: shouldReduceMotion ? 0 : 18,
                scale: shouldReduceMotion ? 1 : 0.9,
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                x: shouldReduceMotion ? 0 : 12,
                scale: shouldReduceMotion ? 1 : 0.92,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: -4,
                      scale: 1.04,
                    }
              }
              whileTap={
                shouldReduceMotion
                  ? undefined
                  : {
                      x: -6,
                      scale: 0.94,
                    }
              }
              transition={transition}
              className="absolute inset-e-0 flex cursor-pointer items-center text-gray-500 outline-none"
            >
              <small className="whitespace-nowrap font-peyda">رد کردن</small>

              <PiCaretLeft
                className="compact:text-5xl fold:text-6xl laptop:text-7xl"
                aria-hidden="true"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="flex w-full items-start justify-center overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {subTitle && (
            <motion.h2
              key={subTitle}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : -6,
              }}
              transition={{
                duration: shouldReduceMotion ? 0.1 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-4/5 font-peyda text-center compact:text-sm fold:text-base laptop:text-lg font-medium leading-5 text-blue-600"
            >
              {subTitle}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default PlaygroundFlowHeader;
