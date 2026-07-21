import { easeInOut, motion } from "framer-motion";
import {
  PiAlarmFill,
  PiCaretLeftBold,
  PiFastForward,
  PiForkKnife,
  PiListChecks,
  PiPersonSimpleTaiChi,
  PiTarget,
  PiWallet,
} from "react-icons/pi";
import Button from "../../../shared/base-components/button";

const ChoosePlanForm = () => {
  return (
    <motion.div
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 24, opacity: 0 }}
      transition={{ duration: 0.4, ease: easeInOut }}
      className="flex
                    min-h-full
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    flex-col
                    items-start
                    gap-2
                    overflow-x-clip
                    compact:px-4
                    mobile-lg:px-6
                    py-7
                    will-change-[transform,opacity]"
    >
      <h2 className="shrink-0 font-yekan text-lg font-extrabold">
        دو راه پیش روی شماست...
      </h2>
      <div className="w-full flex-1 flex flex-col justify-start items-center gap-2">
        <div className="flex-1 w-full bg-green-950 border border-green-400 rounded-sm px-3 py-4 flex flex-col justify-between items-center gap-2">
          <div className="flex w-full flex-row justify-between items-center">
            <h3 className="font-peyda compact:text-base mobile:text-lg font-bold text-nowrap">
              رژیم هوشمند زیست‌آپ
            </h3>
            <div className="flex flex-row justify-start items-center gap-1 bg-green-400 text-black rounded-full px-1.5 py-1">
              <PiAlarmFill className="text-base" />
              <label className="font-peyda text-xxs font-semibold">
                مدت زمان مورد نیاز 8 دقیقه
              </label>
            </div>
          </div>
          <div className="w-full font-peyda text-right space-y-0.5">
            <h4 className="text-sm font-semibold text-green-400">
              8 مرحله بازی‌وار
            </h4>
            <p className="text-sm font-normal">
              رژیمی که برای تو ساخته می‌شود؛ بر اساس سبک زندگی، بودجه، سلیقه
              غذایی و هدف تو
            </p>
          </div>
          <ul className="w-full flex flex-row items-center justify-between gap-2">
            <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiPersonSimpleTaiChi className="text-2xl" />
              <small className="text-xxs font-normal">سبک زندگی</small>
            </li>
            <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiTarget className="text-2xl" />
              <small className="text-xxs font-normal">هدف شما</small>
            </li>
            <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiForkKnife className="text-2xl" />
              <small className="text-xxs font-normal">سلیقه غذایی</small>
            </li>
            <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiWallet className="text-2xl" />
              <small className="text-xxs font-normal">بودجه</small>
            </li>
          </ul>
          <Button
            classes="btn btn-primary-green text-sm! font-semibold! py-1!"
            title="شروع این مسیر"
            icon={<PiCaretLeftBold />}
          />
        </div>
        <div className="flex-1 w-full bg-darker-blue-100 border border-blue-400 rounded-sm px-3 py-4 flex flex-col justify-between items-center gap-2">
          <div className="flex w-full flex-row justify-between items-center">
            <h3 className="font-peyda compact:text-base mobile:text-lg font-bold text-nowrap">
              رژیم‌های مرسوم
            </h3>
            <div className="flex flex-row justify-start items-center gap-1 bg-blue-400 text-black rounded-full px-1.5 py-1">
              <PiAlarmFill className="text-base" />
              <label className="font-peyda text-xxs font-semibold">
                مدت زمان مورد نیاز کمتر از 1 دقیقه
              </label>
            </div>
          </div>
          <div className="w-full font-peyda text-right space-y-0.5">
            <h4 className="text-sm font-semibold text-blue-400">
              مناسب شروع سریع
            </h4>
            <p className="text-sm font-normal">
              انتخاب بین 6 رژیم مرسوم که توسط تیم متخصصین زیستاپ بهینه شده
            </p>
          </div>
          <ul className="w-full grid grid-cols-4 items-center justify-center gap-2">
            <li className="col-start-2 bg-blue-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiFastForward className="text-2xl" />
              <small className="text-xxs font-normal">سریع</small>
            </li>
            <li className="col-start-3 bg-blue-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
              <PiListChecks className="text-2xl" />
              <small className="text-xxs font-normal">ساده</small>
            </li>
          </ul>
          <Button
            classes="btn btn-primary-blue text-sm! font-semibold! py-1!"
            title="مشاهده رژیم‌های آماده"
            icon={<PiCaretLeftBold />}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChoosePlanForm;
