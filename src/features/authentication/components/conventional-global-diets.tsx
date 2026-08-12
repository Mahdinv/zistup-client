import ScrollFade from "../../../shared/base-components/scroll-fade";
import { useQuery } from "@tanstack/react-query";
import { getDiets } from "../services/diet.service";
import type { Diet } from "../models/diet.types";
import DietOption from "./diet-option";
import Skeleton from "react-loading-skeleton";
import type { AuthNavigationState } from "../types/auth-navigation-state";

const ConventionalGlobalDiets = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["diets"],
    queryFn: getDiets,
    staleTime: 60 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="w-full shrink-0 font-yekan text-lg font-extrabold select-none">
        رژیم خودت رو انتخاب کن
      </h2>
      <ScrollFade>
        <ul className="min-h-0 w-full flex-1 bgdarker flex flex-col justify-start items-start gap-5 overflow-y-auto">
          {isLoading ? (
            <Skeleton
              width="100%"
              height={50}
              count={5}
              borderRadius={12}
              containerClassName="w-full flex flex-col gap-1"
            />
          ) : (
            (data || []).map((diet: Diet) => {
              const routeState: AuthNavigationState<Diet> = {
                data: diet,
                authHeader: {
                  firstLineTitle: "رژیم",
                  secondLineTitle: diet.title,
                  subTitle: diet.subTitle,
                  imageName: diet.image,
                  backTo: "/auth/choose-plan/conventional-global-diets",
                },
              };
              return <DietOption key={diet.id} routeState={routeState} />;
            })
          )}
        </ul>
      </ScrollFade>
    </div>
  );
};

export default ConventionalGlobalDiets;
