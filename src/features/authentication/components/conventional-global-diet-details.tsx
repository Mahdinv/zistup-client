import { motion, easeInOut } from "framer-motion";

const ConventionalGlobalDietDetails = () => {
  return (
    <motion.div
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex
                    h-full
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    flex-col
                    items-start
                    justify-between
                    gap-4
                    overflow-x-clip
                    compact:px-4
                    mobile-lg:px-6
                    will-change-[transform,opacity]"
    >
      <h1>ConventionalGlobalDietDetails</h1>
    </motion.div>
  );
};

export default ConventionalGlobalDietDetails;
