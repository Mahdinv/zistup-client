import { useEffect, useState } from "react";
import MainContainer from "../components/main-container";
import { easeInOut, motion } from "framer-motion";
import TextBox from "../../../shared/base-components/text-box";
import Radio from "../../../shared/base-components/radio";
import { LiaFemaleSolid, LiaMaleSolid } from "react-icons/lia";
import Button from "../../../shared/base-components/button";
import NumberPicker from "../../../shared/base-components/number-picker";
import RulerBox from "../../../shared/base-components/ruler-box";
import { useOutletContext } from "react-router-dom";
import type { AuthOutletContext } from "../../../layouts/auth-layout";

const genderOptions = [
  {
    title: "آقا",
    value: "male",
    icon: <LiaMaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
  {
    title: "خانم",
    value: "female",
    icon: <LiaFemaleSolid className="text-2xl" strokeWidth={0.8} />,
  },
];

const mainGoalOptions = [
  { title: "کاهش وزن", value: "weight-loss" },
  { title: "حفظ وزن", value: "weight-maintenance" },
  { title: "افزایش وزن", value: "weight-gain" },
];

const focusOptions = [
  { title: "عضله سازی", value: "muscle-building" },
  { title: "تغذیه سالم", value: "healthy-eating" },
  { title: "محیط زیست", value: "environment" },
  { title: "سایر...", value: "others" },
];

const DemographicInformation = () => {
  const { setBackHandler } = useOutletContext<AuthOutletContext>();
  const [step, setStep] = useState<1 | 2>(1);
  const [number, setNumber] = useState(20);
  const [height, setHeight] = useState(150);

  useEffect(() => {
    if (step === 2) {
      setBackHandler(() => {
        setStep(1);
      });
    }

    return () => {
      setBackHandler(null);
    };
  }, [step, setBackHandler]);

  return (
    <MainContainer isFirstStep={step === 1} isLastStep={step === 2}>
      {step === 1 ? (
        <motion.div
          key="step-1"
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
          <div
            className="flex 
                          w-full 
                          min-w-0 
                          max-w-none 
                          flex-col 
                          items-center 
                          justify-start 
                          gap-2.5
                          overflow-x-hidden 
                          overflow-y-auto 
                          scrollbar-none 
                          [-ms-overflow-style:none] 
                          [&::-webkit-scrollbar]:hidden"
          >
            <TextBox
              inlineLabel
              label="نام و نشان"
              placeHolder="مثال: پارسا متینی"
            />
            <Radio
              inlineLabel
              label="جنسیت"
              gridClasses="grid-cols-2 gap-1"
              options={genderOptions}
              value="male"
              onChange={() => {}}
            />
            <NumberPicker
              label="وزن"
              subLabel="(کیلوگرم)"
              min={0}
              max={200}
              value={number}
              onChangeEnd={setNumber}
            />
            <RulerBox
              label="قد"
              subLabel="(سانتی متر)"
              min={150}
              max={210}
              step={1}
              majorStep={5}
              value={height}
              onChange={setHeight}
              onChangeEnd={(finalHeight) => {
                console.log("قد نهایی انتخاب‌شده:", finalHeight);
              }}
            />
            <NumberPicker
              label="سن"
              min={0}
              max={100}
              value={number}
              onChangeEnd={setNumber}
            />
          </div>
          <Button
            classes="btn btn-primary"
            title="مرحله بعد"
            onClick={() => setStep(2)}
          />
        </motion.div>
      ) : (
        <motion.div
          key="step-2"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className="flex
                    h-full
                    w-full
                    min-w-0
                    max-w-full
                    flex-1
                    flex-col
                    items-start
                    justify-start
                    gap-6
                    overflow-x-clip
                    compact:px-4
                    mobile-lg:px-6
                    will-change-[transform,opacity]"
        >
          <Radio
            label="هدف اصلی تو چیه؟"
            subLabel="(فقط یک انتخاب)"
            gridClasses="grid-cols-3 gap-1"
            options={mainGoalOptions}
            value="weight-gain"
            onChange={() => {}}
          />
          <Radio
            label="دوست داری روی چیا بیشتر تمرکز کنیم؟"
            gridClasses="grid-cols-3 gap-1"
            options={focusOptions}
            value="environment"
            onChange={() => {}}
          />
          <div className="w-full h-full flex flex-col justify-end">
            <Button
              classes="btn btn-primary"
              title="ثبت اطلاعات"
              onClick={() => setStep(1)}
            />
          </div>
        </motion.div>
      )}
    </MainContainer>
  );
};

export default DemographicInformation;
