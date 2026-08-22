import { PiCheckFatFill, PiLockSimple, PiTrophyFill } from "react-icons/pi";
import type { RoadMapStep } from "../api/road-map.types";
import Button from "@/shared/base-components/button";
import { useNavigate } from "react-router-dom";

type RoadMapProps = {
  step: RoadMapStep;
};

const RoadMap = ({ step }: RoadMapProps) => {
  const navigate = useNavigate();

  return (
    <li className="w-full h-auto flex flex-row justify-center items-stretch">
      <div className="relative flex-2/12 flex flex-row justify-center">
        <div
          className={`
                      absolute 
                      compact:w-8 
                      compact:h-8 
                      fold:w-10 
                      fold:h-10 
                      laptop:w-11 
                      laptop:h-11
                      border
                      ${step.key === "personalized_diet" ? "bg-[#776D30] border-[1.5px] border-yellow-200" : step.status === "current" ? "bg-green-950 border-green-500" : "bg-darker-blue-200 border-blue-900"}
                      rounded-full 
                      flex 
                      flex-row 
                      justify-center 
                      items-center 
                      font-rokh
                    `}
        >
          {step.key === "personalized_diet" ? (
            <PiTrophyFill className="text-yellow-200 compact:text-xl fold:text-2xl laptop:text-3xl" />
          ) : step.status === "completed" ? (
            <PiCheckFatFill className="text-darker-blue-100 compact:text-xl fold:text-2xl laptop:text-3xl" />
          ) : (
            <small
              className={`mt-2 compact:text-3xl laptop:text-4xl ${step.status === "current" || step.status === "completed" ? " text-green-500" : "text-blue-900"}`}
            >
              {step.step}
            </small>
          )}
        </div>
        <div
          className={`${step.key === "personalized_diet" && "hidden"} bg-darker-blue-100 w-0.5 h-[130%]`}
        ></div>
      </div>
      <div
        className={`flex-10/12 bg-darker-blue-300 border ${step.status === "current" ? "border-green-950" : "border-darker-blue-100"} rounded-sm flex flex-col justify-start items-center gap-2 p-3`}
      >
        <div className="w-full flex flex-col justify-center items-start gap-1">
          <div className="w-full flex flex-row justify-between items-center">
            <small className="text-blue-700 compact:text-xxs fold:text-xs laptop:text-sm font-peyda font-medium">
              {step.subtitle}
            </small>
            <small
              className={`${step.status === "completed" ? "text-green-400" : step.status === "skipped" ? "text-gray-400" : "hidden"} font-peyda compact:text-xxs fold:text-xs laptop:text-sm font-medium`}
            >
              {step.status === "completed" ? "تکمیل شد" : "ناتمام"}
            </small>
            <PiLockSimple
              className={`${step.status === "locked" ? "block" : "hidden"} compact:text-lg fold:text-xl laptop:2xl: text-blue-900`}
            />
          </div>
          <h2
            className={`${step.status === "current" || step.status === "locked" ? "text-white" : "text-gray-400"} compact:text-lg fold:text-xl laptop:text-2xl font-peyda font-medium`}
          >
            {step.title}
          </h2>
        </div>
        {step.status === "current" && (
          <Button
            classes="btn btn-primary-green compact:text-sm! fold:text-base! laptop:text-lg! py-1! rounded-sm! font-bold!"
            title="شروع این مرحله"
            onClick={() => navigate(`/game-workflow${step.link}`)}
          />
        )}
      </div>
    </li>
  );
};

export default RoadMap;
