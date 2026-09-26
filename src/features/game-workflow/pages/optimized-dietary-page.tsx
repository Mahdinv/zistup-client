import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PiAlarm,
  PiCoins,
  PiHeartbeat,
  PiPlant,
  PiTrophyFill,
} from "react-icons/pi";

import AnimatedDietLogo from "../components/optimized-dietary/animated-zistup-loader";
import DietSlider from "../components/optimized-dietary/diet-slider";
import LoaderStep from "../components/optimized-dietary/loader-step";

import type { LoaderStepType } from "../api/optimized-dietary.types";
import useDietLoader from "../hooks/use-diet-loader.hook";
import useOptimizedDietaryQuery from "../hooks/use-optimized-dietary-query.hook";

const sliderItems = [
  {
    name: "environment-slider-item",
    icon: <PiPlant />,
    title: "انتخاب‌های سازگارتر با طبیعت",
    description: "اثر محیط‌زیستی انتخاب‌ها در ساخت برنامه در نظر گرفته شده.",
  },
  {
    name: "health-slider-item",
    icon: <PiHeartbeat />,
    title: "تغذیه متعادل‌تر برای هدفت",
    description: "برنامه‌ات بر اساس هدف و نیازهای تغذیه‌ای تو تنظیم شده.",
  },
  {
    name: "price-slider-item",
    icon: <PiCoins />,
    title: "هماهنگ با بودجه تو",
    description: "سبد غذایی با بودجه‌ای که تعیین کردی تنظیم شده.",
  },
  {
    name: "available-slider-item",
    icon: <PiAlarm />,
    title: "سهولت تهیه",
    description: "مواد غذایی و آماده‌سازی با زمان و شرایط تو هماهنگ شده.",
  },
];

const initialLoaderSteps: LoaderStepType[] = [
  {
    id: 1,
    title: "شناخت اطلاعات پایه",
    description: "تحلیل داده‌های پایه و شاخص‌های فردی.",
    status: "in-progress",
  },
  {
    id: 2,
    title: "ارزیابی الگوی مصرف",
    description: "بررسی سوابق تغذیه‌ای هفته گذشته.",
    status: "pending",
  },
  {
    id: 3,
    title: "همگام‌سازی ذائقه",
    description: "اعمال ترجیحات و علاقه‌مندی‌های غذایی.",
    status: "pending",
  },
  {
    id: 4,
    title: "تولید اولیه سبد",
    description: "چیدمان مواد اولیه متناسب با نیاز شما.",
    status: "pending",
  },
  {
    id: 5,
    title: "توازن چهار شاخص اصلی",
    description: "تنظیم هم‌زمان سلامت، هزینه، زمان و محیط‌زیست.",
    status: "pending",
  },
  {
    id: 6,
    title: "تطبیق هوشمند با هدف",
    description: "بیشترین میزان سازگاری با هدف انتخابی.",
    status: "pending",
  },
  {
    id: 7,
    title: "آماده‌سازی برنامه اختصاصی و خروجی نهایی",
    description: "پردازش نهایی داده‌ها توسط الگوریتم زیستاپ.",
    status: "pending",
  },
];

const loaderStepDurations = [3000, 3000, 3000, 6000, 4000, 4000, 7000];

const resultVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const resultItemVariants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const OptimizedDietaryPage = () => {
  const [canStartPolling, setCanStartPolling] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCanStartPolling(true);
    }, 30_000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const optimizedDietQuery = useOptimizedDietaryQuery(canStartPolling);

  const isRequestDone = optimizedDietQuery.data?.status === true;

  const { loaderSteps, isLoaderCompleted } = useDietLoader({
    steps: initialLoaderSteps,
    durations: loaderStepDurations,
    isRequestDone,
  });

  useEffect(() => {
    if (!isLoaderCompleted) return;

    const timeoutId = window.setTimeout(() => {
      setShowResult(true);
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [isLoaderCompleted]);

  return (
    <PlaygroundFlowContainer>
      {!showResult ? (
        <ScrollFade>
          <div className="w-full h-full flex flex-col justify-start items-center gap-2 pt-4">
            <h1 className="text-white font-yekan font-extrabold compact:text-3xl fold:text-4xl laptop:text-5xl">
              در حال ساخت برنامه تو...
            </h1>

            <AnimatedDietLogo
              className="
                compact:w-38.75 mobile:w-42.5 mobile-lg:w-45
                fold:w-48.75 laptop:w-52 desktop:w-60
              "
            />

            <ol className="w-full flex flex-col justify-center items-center px-0.5">
              {loaderSteps.map((step, index) => (
                <LoaderStep
                  key={step.id}
                  step={step}
                  isLastStep={index === loaderSteps.length - 1}
                />
              ))}
            </ol>
          </div>
        </ScrollFade>
      ) : (
        <motion.div
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          className="
            w-full h-full flex flex-col justify-between items-center gap-2
            pt-[calc(1.75rem+env(safe-area-inset-top))]
            pb-[calc(1.75rem+env(safe-area-inset-bottom))]
          "
        >
          <ScrollFade>
            <div className="flex-1 w-full flex flex-col justify-start items-center gap-3">
              <motion.div variants={resultItemVariants} className="px-6">
                <div className="w-full bg-green-900 rounded-2xl p-4 flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="w-full flex flex-row items-center gap-2">
                      <div
                        className="
                          bg-[#776D30] border border-yellow-200 rounded-full
                          compact:size-6.5 fold:size-7 laptop:size-7.5
                          flex justify-center items-center
                        "
                      >
                        <PiTrophyFill className="text-yellow-200 compact:text-base fold:text-lg laptop:text-xl" />
                      </div>

                      <h1 className="flex-1 text-white font-yekan font-extrabold compact:text-xl fold:text-2xl laptop:text-3xl">
                        برنامه اختصاصی شما آماده‌ست!
                      </h1>
                    </div>

                    <p
                      className="
                        font-peyda font-medium text-justify tracking-wide
                        leading-[140%] text-white
                        compact:text-base fold:text-lg laptop:text-xl
                      "
                    >
                      با الگوریتم زیستاپ انتخاب‌هات رو کنار هم گذاشتیم و
                      برنامه‌ای ساختیم که با شرایط و اولویت‌هات سازگارتره.
                    </p>
                  </div>

                  <div className="w-full bg-darker-blue-300 border-2 border-blue-400 rounded-sm py-3 px-4">
                    <h2 className="font-yekan font-extrabold text-blue-400 leading-[120%] text-center compact:text-xl fold:text-2xl laptop:text-3xl">
                      همگام و مطابق سبک زندگی شما
                    </h2>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={resultItemVariants} className="w-full">
                <DietSlider items={sliderItems} autoplayDelay={5000} />
              </motion.div>
            </div>
          </ScrollFade>

          <motion.div variants={resultItemVariants} className="w-full px-6">
            <Button
              type="submit"
              classes="btn btn-primary-green"
              title="شروع و پیگیری وعده ها در داشبورد"
            />
          </motion.div>
        </motion.div>
      )}
    </PlaygroundFlowContainer>
  );
};

export default OptimizedDietaryPage;
