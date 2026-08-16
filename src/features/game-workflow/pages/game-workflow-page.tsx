import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import { PiTrophyFill } from "react-icons/pi";

// const headerStepsData = [
//   {
//     title: "انتخاب هدف",
//     subTitle: "هدف اصلی خود از رژیم را مشخص کنید",
//   },
//   {
//     title: "ترجیحات غذایی",
//     subTitle: "غذاهای مورد علاقه خود را انتخاب کنید",
//   },
// ];

const GameWorkflowPage = () => {
  // const [step, setStep] = useState(1);

  // usePlaygroundFlowHeader({
  //   step,
  //   setStep,
  //   headerStepsData,
  // });

  // const handleNext = () => {
  //   if (step >= headerStepsData.length) return;

  //   setStep((prev) => prev + 1);
  // };

  return (
    <ScrollFade>
      <PlaygroundFlowContainer>
        <ol className="w-full flex flex-col justify-start items-center gap-3">
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
              <Button
                classes="btn btn-primary-green text-sm! py-1! rounded-sm! font-bold!"
                title="شروع این مرحله"
              />
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-darker-blue-200 border border-blue-900 rounded-full flex flex-row justify-center items-center font-rokh">
                <small className="mt-2 text-3xl text-blue-900">1</small>
              </div>
              <div className="bg-darker-blue-100 w-0.5 h-[130%]"></div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
          <li className="w-full h-auto flex flex-row justify-center items-stretch">
            <div className="relative flex-2/12 flex flex-row justify-center">
              <div className="absolute compact:w-8 compact:h-8 fold:w-10 fold:h-10 bg-[#776D30] border-[1.5px] border-yellow-200 rounded-full flex flex-row justify-center items-center font-rokh">
                <PiTrophyFill className="text-yellow-200 compact:text-xl fold:text-2xl" />
              </div>
            </div>
            <div className="flex-10/12 bg-darker-blue-300 border border-green-950 rounded-sm flex flex-col justify-start items-center gap-2 p-3">
              <div className="w-full flex flex-col justify-center items-start gap-1">
                <small className="text-blue-700 text-xxs font-peyda font-medium">
                  مرحله اول
                </small>
                <h2 className="text-white text-lg font-peyda font-medium">
                  پرسشنامه اولیه
                </h2>
              </div>
            </div>
          </li>
        </ol>
      </PlaygroundFlowContainer>
    </ScrollFade>
  );
};

export default GameWorkflowPage;
