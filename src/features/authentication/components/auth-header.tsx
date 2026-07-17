import { PiCaretRight } from "react-icons/pi";
import { easeInOut, motion } from "framer-motion";

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
  return (
    <div className="w-full h-[clamp(160px,27dvh,300px)] shrink-0 compact:px-4 mobile-lg:px-6 relative flex flex-col justify-around bg-blue-300 select-none">
      <motion.div
        initial={{ visibility: "hidden", opacity: 1 }}
        animate={{
          visibility: onBack ? "visible" : "hidden",
          opacity: onBack ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: easeInOut }}
        className={`self-start text-blue-600 border border-blue-600 rounded-sm p-1.5 cursor-pointer`}
        onClick={onBack}
      >
        <PiCaretRight className="text-xl" />
      </motion.div>
      <div className="space-y-1.5">
        <h1 className="font-yekan text-8xl font-extrabold">{firstLineTitle}</h1>
        <h1 className="font-yekan text-8xl font-extrabold">
          {secondLineTitle}
          {subTitle && (
            <span className="text-lg font-extrabold mr-1">{subTitle}</span>
          )}
        </h1>
      </div>
      {imageName && (
        <img
          src={`/images/choose-plan/${imageName}`}
          className="compact:top-2/5 
                     mobile-lg:top-1/2 
                     compact:left-[4%] fold:left-[8%] 
                     compact:w-[50%] 
                     mobile:w-[50%] 
                     mobile-lg:w-[45%] 
                     fold:w-[35%] 
                     tablet:w-[45%]
                     desktop:w-2/5 
                     pointer-events-none absolute h-auto -translate-y-1/2"
          alt="alt-name"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default AuthHeader;
