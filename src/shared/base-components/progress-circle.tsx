import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export const ProgressCirclePulse = ({ className }: { className?: string }) => (
  <motion.div
    className={cn(
      "absolute inset-0 origin-center rounded-full border border-blue-900 pointer-events-none will-change-[transform,opacity]",
      className,
    )}
    initial={{ scale: 1, opacity: 0 }}
    animate={{
      scale: [1, 1.05, 1.5, 1.5, 1],
      opacity: [0, 0.8, 0.7, 0, 0],
    }}
    transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
  />
);

export const ProgressCircleDot = ({
  isInProgress,
  className,
  sizeClassName = "compact:size-3 fold:size-4 laptop:size-5",
}: {
  isInProgress: boolean;
  className?: string;
  sizeClassName?: string;
}) => (
  <motion.div
    className={cn(
      "absolute border border-blue-900 rounded-full transition-[background-color,box-shadow] duration-500",
      sizeClassName,
      isInProgress
        ? "bg-blue-400 shadow-[0_0_10.7px_0_rgba(117,213,230,0.4)]"
        : "bg-transparent",
      className,
    )}
    initial={false}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.15, ease: "easeOut" }}
  />
);
