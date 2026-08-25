import {
  PiAlarmFill,
  PiCaretLeftBold,
  PiForkKnife,
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
      <ScrollFade>
        <div
          className="
          grid
          w-full
          flex-1
          grid-rows-[repeat(2,minmax(1fr, auto))]
          gap-2
           overflow-y-auto
        "
        >
          <article className="flex w-full flex-col items-center justify-between gap-6 rounded-2xl bg-darker-green-100 p-4">
            <div className="flex w-full flex-row justify-between items-center">
              <h3 className="font-peyda compact:text-xl mobile:text-2xl laptop:text-3xl font-bold text-nowrap">
                رژیم هوشمند زیست‌آپ
              </h3>
              <div className="flex flex-row justify-start items-center gap-1 bg-green-950 text-white rounded-full px-3 py-1.5">
                <PiAlarmFill className="compact:text-base laptop:text-xl" />
                <label className="font-peyda compact:text-sm laptop:text-base font-bold mt-0.5">
                  <span className="font-rokh">8</span> دقیقه
                </label>
              </div>
            </div>
            <div className="w-full font-peyda text-right space-y-2.5">
              <h4 className="compact:text-base laptop:text-xl font-bold text-green-400">
                چالش هشت مرحله‌ای
              </h4>
              <p className="compact:text-base laptop:text-xl font-normal">
                طراحی صدرصد اختصاصی بر اساس شرایط واقعی روزمره و آنالیز بدن تو
              </p>
            </div>
            <ul className="w-full flex flex-row items-center justify-between gap-2">
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
                <PiPersonSimpleTaiChi
                  className="compact:text-4xl laptop:text-4xl"
                  strokeWidth={5}
                />
                <small className="compact:text-xs laptop:text-base font-bold">
                  سبک زندگی
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
                <PiWallet
                  className="compact:text-4xl laptop:text-4xl"
                  strokeWidth={5}
                />
                <small className="compact:text-xs laptop:text-base font-bold">
                  بودجه
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
                <PiTarget
                  className="compact:text-4xl laptop:text-4xl"
                  strokeWidth={5}
                />
                <small className="compact:text-xs laptop:text-base font-bold">
                  هدف شخصی
                </small>
              </li>
              <li className="w-full bg-green-800 rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
                <PiForkKnife
                  className="compact:text-4xl laptop:text-4xl"
                  strokeWidth={5}
                />
                <small className="compact:text-xs laptop:text-base font-bold">
                  سلیقه غذایی
                </small>
              </li>
            </ul>
            <Button
              classes="btn btn-primary-green compact:text-[18px]! laptop:text-2xl! font-bold! compact:py-1! laptop:py-2!"
              title="شروع ساخت رژیم اختصاصی"
              icon={<PiCaretLeftBold />}
              onClick={() => {
                navigate("/game-workflow");
              }}
            />
          </article>

          <article className="flex w-full flex-col items-center justify-start gap-6 rounded-2xl bg-darker-blue-300 p-4">
            <div className="flex w-full flex-row justify-between items-center">
              <h3 className="font-peyda compact:text-xl mobile:text-2xl laptop:text-3xl font-bold text-nowrap">
                رژیم‌های مرسوم
              </h3>
              <div className="flex flex-row justify-start items-center gap-1 bg-darker-blue-200 text-white rounded-full px-1.5 py-1">
                <PiAlarmFill className="compact:text-base laptop:text-xl" />
                <label className="font-peyda compact:text-sm laptop:text-base font-bold mt-0.5">
                  زیر <span className="font-rokh">1</span> دقیقه
                </label>
              </div>
            </div>
            <div className="w-full font-peyda text-right space-y-2.5">
              <h4 className="compact:text-base laptop:text-xl font-bold text-blue-400">
                مناسب شروع سریع
              </h4>
              <p className="compact:text-base laptop:text-xl font-normal">
                انتخاب از میان شش برنامه معروف جهانی (کتو، فستینگ و...) با فرمول
                بهینه‌شده زیستاپ
              </p>
            </div>
            <Button
              classes="btn btn-primary-blue compact:text-[18px]! laptop:text-2xl! font-bold! compact:py-1! laptop:py-2!"
              title="انتخاب رژیم آماده"
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
