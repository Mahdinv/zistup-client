import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import GameCompletedModal from "../components/game-completed-modal";
import ScrollFade from "@/shared/base-components/scroll-fade";
import Button from "@/shared/base-components/button";
import Sortable, { type SortableEvent } from "sortablejs";
import { FaCheck } from "react-icons/fa6";
import CircleProgress from "../components/social-alignment/circle-progress";
import { RxDragHandleDots2 } from "react-icons/rx";
import type { SocialAlignmentForm } from "../schemas/social-alignment.schema";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import type { FoodGroup } from "../api/food-group.types";
import SocialAlignmentSkeleton from "../components/social-alignment/social-alignment-skeleton";
import { normalizeApiError } from "@/shared/api";
import { toast } from "sonner";
import {
  addSocialAlignment,
  getSocialAlignments,
} from "../api/social-alignment.api";
import { useLocation, useNavigate } from "react-router-dom";
import type { PreferredFood } from "../api/preferred-food.types";
import type { SocialAlignment } from "../api/social-alignment.types";
import { getPreferredFoods } from "../api/preferred-food.api";

const societyRanks = [
  { foodGroupId: 13, rank: 9 }, // Eggs
  { foodGroupId: 14, rank: 19 }, // Dairy
  { foodGroupId: 11, rank: 10 }, // Meat
  { foodGroupId: 12, rank: 13 }, // Poultry
  { foodGroupId: 3, rank: 2 }, // Honey & Sweeteners
  { foodGroupId: 10, rank: 8 }, // Fish & seafood
  { foodGroupId: 16, rank: 5 }, // Olives and dates
  { foodGroupId: 1, rank: 12 }, // Sugar
  { foodGroupId: 5, rank: 4 }, // Oils Misc
  { foodGroupId: 6, rank: 11 }, // Oils seed
  { foodGroupId: 4, rank: 1 }, // Oil olive
  { foodGroupId: 17, rank: 16 }, // Fruit
  { foodGroupId: 15, rank: 18 }, // Vegetables
  { foodGroupId: 18, rank: 6 }, // Nuts
  { foodGroupId: 19, rank: 7 }, // Legumes
  { foodGroupId: 7, rank: 15 }, // Potatoes
  { foodGroupId: 2, rank: 3 }, // Stimuli
  { foodGroupId: 8, rank: 14 }, // Rice
  { foodGroupId: 20, rank: 17 }, // Barley & Maize
  { foodGroupId: 9, rank: 20 }, // Wheat & Rye (Bread)
];

const calculateX = (lastPriority: number, newPriority: number) => {
  const D = Math.abs(lastPriority - 21) / 20;
  const N = newPriority / 20;
  return Number((D * N).toFixed(4));
};

const SocialAlignmentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLUListElement | null>(null);

  const actionType = state?.actionType ?? undefined;

  const {
    data: socialAlignments,
    isLoading: isSocialAlignmentsLoading,
    isSuccess: isSocialAlignmentsSuccess,
  } = useQuery<SocialAlignment[]>({
    queryKey: ["socialAlignments"],
    queryFn: getSocialAlignments,
    enabled: actionType !== "create",
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const shouldFetchPreferredFoods =
    actionType === "create" ||
    (actionType !== "create" &&
      isSocialAlignmentsSuccess &&
      socialAlignments.length === 0);

  const { data: preferedFoodItems, isLoading: isPreferredFoodsLoading } =
    useQuery<PreferredFood[]>({
      queryKey: ["preferredFoods"],
      queryFn: getPreferredFoods,
      enabled: shouldFetchPreferredFoods,
      staleTime: Infinity,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const isLoading =
    actionType === "create"
      ? isPreferredFoodsLoading
      : isSocialAlignmentsLoading ||
        (shouldFetchPreferredFoods && isPreferredFoodsLoading);

  const formValues = useMemo<SocialAlignmentForm>(() => {
    if (
      !socialAlignments ||
      socialAlignments === undefined ||
      socialAlignments.length === 0
    ) {
      return {
        items: (preferedFoodItems || []).map(
          (pfi: {
            foodGroupId: number;
            priority: number;
            foodGroup: FoodGroup;
          }) => ({
            foodGroupId: pfi.foodGroupId,
            title: pfi.foodGroup.title,
            imageUrl: pfi.foodGroup.properties.imageUrl,
            priority: pfi.priority,
            newPriority: pfi.priority,
            x: calculateX(pfi.priority, pfi.priority),
          }),
        ),
      };
    }

    return {
      items: (socialAlignments || []).map(
        (socialAlignment: SocialAlignment) => ({
          foodGroupId: socialAlignment.foodGroupId,
          title: socialAlignment.foodGroup.title,
          imageUrl: socialAlignment.foodGroup.properties.imageUrl,
          priority: socialAlignment.priority,
          newPriority: socialAlignment.priority,
          x: socialAlignment.x,
        }),
      ),
    };
  }, [preferedFoodItems, socialAlignments]);

  const method = useForm<SocialAlignmentForm>({
    values: formValues,
  });

  const { control, handleSubmit, getValues, setValue } = method;

  const { fields, move } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  const { mutate, isPending } = useMutation({
    mutationFn: addSocialAlignment,
    onSuccess: async () => {
      if (actionType === "create") {
        setModal(true);
      } else {
        toast.success("ویرایش مرحله هفتم با موفقیت انجام شد");
        navigate("/game-workflow");
      }
      queryClient.invalidateQueries({ queryKey: ["roadMapList"] });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const calculateSimilarity = useMemo<number>(() => {
    let totalFace = 0;
    let totalMouth = 0;

    if (!items?.length) return 0;

    for (const item of items) {
      const societyRank = societyRanks.find(
        (rank) => rank.foodGroupId === item.foodGroupId,
      )?.rank;

      if (societyRank === undefined) continue;

      totalFace += Math.abs(societyRank - item.newPriority);
      totalMouth += societyRank + item.newPriority;
    }

    if (totalMouth === 0) return 0;

    const calculate = (totalFace / totalMouth) ** 1.1;

    return Math.min(100, Math.max(0, Math.round(100 * (1 - calculate))));
  }, [items]);

  useEffect(() => {
    if (isLoading || !listRef.current) return;

    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      onEnd: ({ oldIndex, newIndex }: SortableEvent) => {
        if (oldIndex === undefined || newIndex === undefined) return;
        if (oldIndex === newIndex) return;

        move(oldIndex, newIndex);

        const items = getValues("items");

        const updatedItems = items.map((item, index) => {
          const newPriority = 20 - index;
          return {
            ...item,
            newPriority,
            x: calculateX(item.priority, newPriority),
          };
        });

        setValue("items", updatedItems, {
          shouldDirty: true,
        });
      },
    });

    return () => sortable.destroy();
  }, [isLoading, move, getValues, setValue]);

  const onSocialAlignmentFormHandler: SubmitHandler<SocialAlignmentForm> = (
    data,
  ) => mutate(data);

  return (
    <PlaygroundFlowContainer>
      {modal && actionType === "create" && (
        <GameCompletedModal
          open={modal}
          step={7}
          nextGameLink="/game-workflow/limited-shopping"
        />
      )}

      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="w-full shrink-0">
            <CircleProgress value={calculateSimilarity} />
          </div>
          <div className="flex-1 min-h-0">
            <ScrollFade>
              {isLoading ? (
                <SocialAlignmentSkeleton />
              ) : (
                <div className="w-full flex flex-row items-center justify-start gap-2">
                  <ul className="flex flex-col items-center self-start gap-3">
                    {Array.from({ length: 20 }, (_, index) => (
                      <li
                        key={index}
                        className="bg-blue-400 text-black w-full h-13 font-rokh text-center text-5xl rounded-2xl flex justify-center items-center leading-none p-2.5"
                      >
                        <span className="translate-y-1">{index + 1}</span>
                      </li>
                    ))}
                  </ul>
                  <ul
                    ref={listRef}
                    className="grow w-full flex flex-col items-center self-start gap-3"
                  >
                    {fields.map((field) => (
                      <li
                        key={field.id}
                        className="bg-darker-blue-500 w-full h-13 px-3 flex flex-row items-center justify-center gap-1 rounded-2xl shadow-md"
                      >
                        <div className="drag-handle h-full flex items-center cursor-grab">
                          <RxDragHandleDots2 className="text-darker-blue-200 h-full compact:text-5xl fold:text-6xl laptop:text-7xl" />
                        </div>

                        <img
                          src={field.imageUrl}
                          className="compact:size-12 fold:size-13 laptop:size-14 object-contain pointer-events-none select-none"
                          loading="lazy"
                          alt={field.title}
                        />

                        <h5 className="text-white grow font-medium">
                          {field.title}
                        </h5>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollFade>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSocialAlignmentFormHandler)}
          className="w-full flex flex-row items-center gap-2"
        >
          <Button
            type="submit"
            classes="flex-1! btn btn-primary-green shrink-0"
            title="تایید"
            icon={<FaCheck strokeWidth={5} />}
            itemsGap={10}
            disable={isPending}
          />
        </form>
      </div>
    </PlaygroundFlowContainer>
  );
};

export default SocialAlignmentPage;
