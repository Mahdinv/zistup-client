import type { AccountFlowNavigationState } from "@/app/layouts/account-flow/account-flow.types";
import type { Diet } from "@/features/onboarding/api/diet.types";
import Button from "@/shared/base-components/button";
import { memo } from "react";
import {
  PiAlarmFill,
  PiCaretLeftBold,
  PiForkKnife,
  PiPersonSimpleTaiChi,
  PiTarget,
  PiWallet,
} from "react-icons/pi";
import Skeleton from "react-loading-skeleton";
import TargetDietOption from "./target-diet-option";

const TargetDiet = ({
  activeDietKey,
  diets,
  isLoading,
  onNavigate,
}: {
  activeDietKey?: string;
  diets?: Diet[];
  isLoading: boolean;
  onNavigate: (to: string, state: object) => Promise<void>;
}) => {
  const isZistupActive = activeDietKey === "zistpa";
  return (
    <>
      <article className="flex w-full flex-col items-center justify-between gap-6 rounded-2xl bg-darker-green-100 p-4">
        <div className="flex w-full flex-row justify-between items-center">
          <h3 className="font-peyda compact:text-xl mobile:text-2xl laptop:text-3xl font-bold text-nowrap text-white">
            رژیم هوشمند زیست‌آپ
          </h3>
          <div className="flex flex-row justify-start items-center gap-1 bg-green-950 text-white rounded-full px-3 py-1.5">
            <PiAlarmFill className="compact:text-base laptop:text-xl" />
            <label className="font-peyda compact:text-sm laptop:text-base font-bold mt-0.5 whitespace-nowrap">
              <span className="font-rokh">8</span> دقیقه
            </label>
          </div>
        </div>
        <div className="w-full font-peyda text-right space-y-2.5">
          <h4 className="compact:text-base laptop:text-xl font-bold text-green-400">
            چالش هشت مرحله‌ای
          </h4>
          <p className="compact:text-base laptop:text-xl font-normal text-right text-pretty text-white">
            طراحی صدرصد اختصاصی بر اساس شرایط واقعی روزمره و آنالیز بدن تو
          </p>
        </div>
        <ul className="w-full flex flex-row items-center justify-between gap-2">
          <li className="w-full bg-green-950 text-white rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
            <PiPersonSimpleTaiChi
              className="compact:text-4xl laptop:text-4xl"
              strokeWidth={5}
            />
            <small className="compact:text-xs laptop:text-base font-bold whitespace-nowrap">
              سبک زندگی
            </small>
          </li>
          <li className="w-full bg-green-950 text-white rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
            <PiWallet
              className="compact:text-4xl laptop:text-4xl"
              strokeWidth={5}
            />
            <small className="compact:text-xs laptop:text-base font-bold whitespace-nowrap">
              بودجه
            </small>
          </li>
          <li className="w-full bg-green-950 text-white rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
            <PiTarget
              className="compact:text-4xl laptop:text-4xl"
              strokeWidth={5}
            />
            <small className="compact:text-xs laptop:text-base font-bold whitespace-nowrap">
              هدف شخصی
            </small>
          </li>
          <li className="w-full bg-green-950 text-white rounded-[6px] flex flex-col justify-start items-center gap-1.5 py-2 px-1">
            <PiForkKnife
              className="compact:text-4xl laptop:text-4xl"
              strokeWidth={5}
            />
            <small className="compact:text-xs laptop:text-base font-bold whitespace-nowrap">
              سلیقه غذایی
            </small>
          </li>
        </ul>
        {isZistupActive ? (
          <button
            type="button"
            onClick={() =>
              void onNavigate("/game-workflow", { origin: "/app/diets" })
            }
            className="flex h-12 w-full items-center justify-between gap-3 rounded-2xl bg-[#2CE57F] px-3 py-4 font-peyda font-bold text-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
          >
            <div className="flex-11 flex flex-row items-center justify-start compact:gap-2 mobile:gap-3 mobile-lg:gap-4 fold:gap-5 laptop:gap-6">
              <span className="min-w-0 whitespace-nowrap compact:text-lg mobile:text-xl fold:text-2xl leading-none">
                مشاهده نقشه راه
              </span>
              <PiCaretLeftBold aria-hidden="true" className="size-6 shrink-0" />
            </div>
            <span className="flex-1 flex shrink-0 items-center justify-center rounded-full bg-darker-green-100 py-1 pt-2 px-4 text-xs leading-none text-white fold:text-sm">
              فعال
            </span>
          </button>
        ) : (
          <Button
            classes="btn btn-primary-green compact:text-[18px]! laptop:text-2xl! font-bold! compact:py-1! laptop:py-2!"
            title="شروع ساخت رژیم اختصاصی"
            icon={<PiCaretLeftBold />}
            onClick={() => {
              void onNavigate("/game-workflow", { origin: "/app/diets" });
            }}
          />
        )}
      </article>

      <div className="relative w-full h-px bg-blue-600 dark:bg-dark my-4">
        <div className="absolute right-1/2 translate-x-1/2 -translate-y-1/2 px-2 bg-blue-300 dark:bg-darker-blue-500">
          <h2 className="font-peyda font-medium text-blue-700 compact:text-sm mobile:text-base fold:text-lg laptop:text-xl">
            سایر رژیم های مرسوم
          </h2>
        </div>
      </div>

      <ul className="min-h-0 w-full flex-1 bgdarker flex flex-col justify-start items-start gap-2 overflow-y-auto">
        {isLoading ? (
          <Skeleton
            width="100%"
            height={50}
            count={5}
            borderRadius={12}
            containerClassName="w-full flex flex-col gap-1"
          />
        ) : (
          (diets || []).map((diet: Diet) => {
            const routeState: AccountFlowNavigationState<Diet> = {
              data: diet,
              accountFlowHeader: {
                firstLineTitle: "رژیم",
                secondLineTitle: diet.title,
                subTitle: diet.subTitle,
                imageName: diet.image,
                backTo: "/app/diets",
              },
            };
            return (
              <TargetDietOption
                key={diet.id}
                routeState={routeState}
                onNavigate={onNavigate}
                isActive={!isZistupActive && diet.name === activeDietKey}
              />
            );
          })
        )}
      </ul>
    </>
  );
};

export default memo(TargetDiet);
