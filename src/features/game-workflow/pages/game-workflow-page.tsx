import ScrollFade from "@/shared/base-components/scroll-fade";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import { useQuery } from "@tanstack/react-query";
import { getRoadMapList } from "../api/game-workflow.api";
import RoadMap from "../components/road-map";
import type { RoadMapStep } from "../api/road-map.types";
import RoadmapSkeleton from "../components/roadmap-skeleton";

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

  const { data, isLoading } = useQuery({
    queryKey: ["roadMapList"],
    queryFn: getRoadMapList,
    staleTime: Infinity,
  });

  return (
    <PlaygroundFlowContainer
    // stepKey={step}
    >
      <ScrollFade>
        <ol className="w-full flex flex-col justify-start items-center gap-3">
          {isLoading ? (
            <RoadmapSkeleton />
          ) : (
            ((data && data.steps) || []).map((step: RoadMapStep) => (
              <RoadMap key={step.step} step={step} />
            ))
          )}
        </ol>
      </ScrollFade>
    </PlaygroundFlowContainer>
  );
};

export default GameWorkflowPage;
