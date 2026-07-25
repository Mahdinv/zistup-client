import { PiCaretLeftBold } from "react-icons/pi";
import ScrollFade from "../../../shared/base-components/scroll-fade";

const ConventionalGlobalDiets = () => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="w-full shrink-0 font-yekan text-lg font-extrabold select-none">
        رژیم خودت رو انتخاب کن
      </h2>
      <ScrollFade>
        <ul className="min-h-0 w-full flex-1 bgdarker flex flex-col justify-start items-start gap-5 overflow-y-auto">
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">مدیترانه‌ای</h3>
              <h4 className="text-xs font-medium">
                تمرکز بر سلامت قلب، روغن زیتون و سبزیجات
              </h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">
                کتوژنیک <span> (کتو)</span>
              </h3>
              <h4 className="text-xs font-medium">
                چربی‌سوزی سریع با کاهش شدید کربوهیدرات
              </h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">
                اتکینز <span> (کم کربوهیدرات)</span>
              </h3>
              <h4 className="text-xs font-medium">
                کاهش وزن سریع، بهبود قند خون
              </h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">وگان</h3>
              <h4 className="text-xs font-medium">بهبود سلامت قلب، کاهش وزن</h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">
                گیاه‌خواری <span> (لاکتو-اٌوو)</span>
              </h3>
              <h4 className="text-xs font-medium">
                رژیم ۱۰۰٪ گیاهی، سازگار با محیط‌زیست
              </h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
          <li className="w-full bg-blue-900 hover:bg-darker-blue-100 active:bg-darker-blue-100 text-white font-peyda border border-blue-400 rounded-sm px-4 py-2 select-none cursor-pointer flex flex-row justify-between items-center">
            <div className="flex flex-col justify-start items-start gap-1">
              <h3 className="text-lg font-medium">روزه‌داری متناوب</h3>
              <h4 className="text-xs font-medium">
                کاهش وزن هوشمند با مدیریت زمان غذا خوردن
              </h4>
            </div>
            <PiCaretLeftBold className="text-blue-400 text-4xl" />
          </li>
        </ul>
      </ScrollFade>
    </div>
  );
};

export default ConventionalGlobalDiets;
