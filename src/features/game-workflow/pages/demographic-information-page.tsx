import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { PiCity, PiForkKnife, PiPersonSimpleRun } from "react-icons/pi";
import QuestionCard from "../components/question-card";
import Button from "@/shared/base-components/button";
import NumberCounter from "@/shared/base-components/number-counter";
import { useState } from "react";
import ComboBox from "@/shared/base-components/combo-box";
import { iranProvinceCities } from "@/shared/lib/iran-province-cities";

const provinces = iranProvinceCities.map(({ province }) => ({
  value: province,
  label: province,
}));

const DemographicInformationPage = () => {
  const [value, setValue] = useState(5);
  // const cities = iranProvinceCities
  //   .find((ipc) => ipc.province === "خراسان رضوی")
  //   ?.cities.map((city) => ({ value: city, label: city })) ?? [];

  return (
    <PlaygroundFlowContainer>
      <div className="w-full h-full flex flex-col justify-between items-center gap-2">
        <ScrollFade>
          <div className="flex-1 w-full flex flex-col justify-start items-center gap-3">
            <QuestionCard
              icon={<PiPersonSimpleRun className="text-green-600 text-5xl" />}
              title="چند روز ورزش در هفته؟"
              isRequiredField
            >
              <ul className="bg-darker-blue-400 text-white w-full rounded-2xl py-2 px-3 flex flex-row justify-between items-center">
                {Array.from({ length: 8 }).map((_, index) => {
                  const selected = value === index;
                  return (
                    <li
                      className={`w-full text-green-400 ${selected && "border border-green-400"} rounded-xxs font-rokh text-3xl pt-1 px-1.5 text-center`}
                      onClick={() => setValue(index)}
                    >
                      {index}
                    </li>
                  );
                })}
              </ul>
            </QuestionCard>
            <QuestionCard
              icon={<PiCity className="text-green-600 text-5xl" />}
              title="کجا زندگی میکنی؟"
            >
              <div className="w-full flex flex-row justify-center items-center gap-4">
                <ComboBox
                  placeholder="استان"
                  options={provinces}
                  onChange={() => {}}
                />
                <ComboBox
                  placeholder="استان"
                  options={provinces}
                  onChange={() => {}}
                />
              </div>
            </QuestionCard>
            <QuestionCard
              icon={<PiForkKnife className="text-green-600 text-5xl" />}
              title="سهم خوراک از هزینه‌ها؟"
            >
              <NumberCounter
                suffix="%"
                suffixClasses="text-green-400 text-8xl font-rokh"
                valueClasses="pt-1.5!"
              />
            </QuestionCard>
          </div>
        </ScrollFade>
        <Button classes="btn btn-primary-green" title="تایید" />
      </div>
    </PlaygroundFlowContainer>
  );
};

export default DemographicInformationPage;
