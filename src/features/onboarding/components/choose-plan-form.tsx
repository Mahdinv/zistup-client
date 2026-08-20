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
import Button from "@/shared/base-components/button";
import { useNavigate } from "react-router-dom";
import ScrollFade from "@/shared/base-components/scroll-fade";

const ChoosePlanForm = () => {
  const navigate = useNavigate();
  return (
    <section className="flex min-h-full w-full flex-col gap-2">
      {/* <h2 className="shrink-0 font-yekan text-lg font-extrabold select-none">
        دو راه پیش روی شماست...
      </h2> */}
      <ScrollFade>
        <div
          className="
          grid
          w-full
          flex-1
          grid-rows-[repeat(2,minmax(auto,1fr))]
          gap-2
           overflow-y-auto
        "
        >
          <article className="flex w-full flex-col items-center justify-between gap-2 rounded-sm border border-green-400 bg-green-950 px-3 py-4">
            <div className="flex w-full flex-row justify-between items-center">
              <h3 className="font-peyda compact:text-base laptop:text-xl font-bold text-nowrap">
                رژیم هوشمند زیست‌آپ
              </h3>
              <div className="flex flex-row justify-start items-center gap-1 bg-green-400 text-black rounded-full px-1.5 py-1">
                <PiAlarmFill className="compact:text-base laptop:text-xl" />
                <label className="font-peyda compact:text-xxs laptop:text-sm font-semibold">
                  مدت زمان مورد نیاز 8 دقیقه
                </label>
              </div>
            </div>
            <div className="w-full font-peyda text-right space-y-0.5">
              <h4 className="compact:text-sm laptop:text-lg font-semibold text-green-400">
                8 مرحله بازی‌وار
              </h4>
              <p className="compact:text-sm laptop:text-lg font-normal">
                رژیمی که برای تو ساخته می‌شود؛ بر اساس سبک زندگی، بودجه، سلیقه
                غذایی و هدف تو
              </p>
            </div>
            <ul className="w-full flex flex-row items-center justify-between gap-2">
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiPersonSimpleTaiChi className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  سبک زندگی
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiTarget className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  هدف شما
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiForkKnife className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  سلیقه غذایی
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiWallet className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  بودجه
                </small>
              </li>
            </ul>
            <Button
              classes="btn btn-primary-green compact:text-sm! laptop:text-lg! font-semibold! compact:py-1! laptop:py-2!"
              title="شروع این مسیر"
              icon={<PiCaretLeftBold />}
              onClick={() => {
                navigate("/game-workflow");
              }}
            />
          </article>

          <article className="flex w-full flex-col items-center justify-between gap-2 rounded-sm border border-blue-400 bg-darker-blue-100 px-3 py-4">
            <div className="flex w-full flex-row justify-between items-center">
              <h3 className="font-peyda compact:text-base laptop:text-xl font-bold text-nowrap">
                رژیم‌های مرسوم
              </h3>
              <div className="flex flex-row justify-start items-center gap-1 bg-blue-400 text-black rounded-full px-1.5 py-1">
                <PiAlarmFill className="compact:text-base laptop:text-xl" />
                <label className="font-peyda compact:text-xxs laptop:text-sm font-semibold">
                  مدت زمان مورد نیاز کمتر از 1 دقیقه
                </label>
              </div>
            </div>
            <div className="w-full font-peyda text-right space-y-0.5">
              <h4 className="compact:text-sm laptop:text-lg font-semibold text-blue-400">
                مناسب شروع سریع
              </h4>
              <p className="compact:text-sm laptop:text-lg font-normal">
                انتخاب بین 6 رژیم مرسوم که توسط تیم متخصصین زیستاپ بهینه شده
              </p>
            </div>
            <ul className="w-full grid grid-cols-4 items-center justify-center gap-2">
              <li className="col-start-2 bg-blue-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiFastForward className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  سریع
                </small>
              </li>
              <li className="col-start-3 bg-blue-800 rounded-[6px] flex flex-col justify-start items-center gap-1 py-2 px-1">
                <PiListChecks className="compact:text-2xl laptop:text-4xl" />
                <small className="compact:text-xxs laptop:text-sm font-normal">
                  ساده
                </small>
              </li>
            </ul>
            <Button
              classes="btn btn-primary-blue compact:text-sm! laptop:text-lg! font-semibold! compact:py-1! laptop:py-2!"
              title="مشاهده رژیم‌های آماده"
              icon={<PiCaretLeftBold />}
              onClick={() => navigate("conventional-global-diets")}
            />
          </article>
        </div>
      </ScrollFade>
    </section>
  );
};

export default ChoosePlanForm;
