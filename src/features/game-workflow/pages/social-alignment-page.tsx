import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { normalizeApiError } from "@/shared/api";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { arrayMove } from "@dnd-kit/helpers";
import { isSortable } from "@dnd-kit/react/sortable";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { FaCheck } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  addSocialAlignment,
  getSocialAlignments,
} from "../api/social-alignment.api";
import type { SocialAlignment } from "../api/social-alignment.types";
import type { FoodGroup } from "../api/food-group.types";
import { getPreferredFoods } from "../api/preferred-food.api";
import type { PreferredFood } from "../api/preferred-food.types";

import CircleProgress from "../components/social-alignment/circle-progress";
import SocialAlignmentSkeleton from "../components/social-alignment/social-alignment-skeleton";
import SortableSocialAlignmentItem from "../components/social-alignment/sortable-social-alignment-item";
import GameCompletedModal from "../components/game-completed-modal";

import type { SocialAlignmentForm } from "../schemas/social-alignment.schema";

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
  const queryClient = useQueryClient();

  const [modal, setModal] = useState(false);

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

  const { fields, move } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addSocialAlignment,

    onSuccess: async () => {
      if (actionType === "create") {
        setModal(true);
      } else {
        toast.success("ویرایش مرحله هفتم با موفقیت انجام شد");
        navigate("/game-workflow");
      }

      queryClient.invalidateQueries({
        queryKey: ["roadMapList"],
      });
    },

    onError: (error) => {
      const apiError = normalizeApiError(error);

      toast.error(apiError.message);
    },
  });

  const calculateSimilarity = useMemo<number>(() => {
    let totalFace = 0;
    let totalMouth = 0;

    if (!items?.length) {
      return 0;
    }

    for (const item of items) {
      const societyRank = societyRanks.find(
        (rank) => rank.foodGroupId === item.foodGroupId,
      )?.rank;

      if (societyRank === undefined) {
        continue;
      }

      totalFace += Math.abs(societyRank - item.newPriority);
      totalMouth += societyRank + item.newPriority;
    }

    if (totalMouth === 0) {
      return 0;
    }

    const calculate = (totalFace / totalMouth) ** 1.1;

    return Math.min(100, Math.max(0, Math.round(100 * (1 - calculate))));
  }, [items]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) {
        return;
      }

      const { source } = event.operation;

      if (!isSortable(source)) {
        return;
      }

      const { initialIndex, index } = source;

      if (initialIndex === index) {
        return;
      }

      const currentItems = getValues("items");

      const reorderedItems = arrayMove(currentItems, initialIndex, index);

      move(initialIndex, index);

      reorderedItems.forEach((item, itemIndex) => {
        const newPriority = 20 - itemIndex;

        setValue(`items.${itemIndex}.newPriority`, newPriority, {
          shouldDirty: true,
        });

        setValue(
          `items.${itemIndex}.x`,
          calculateX(item.priority, newPriority),
          {
            shouldDirty: true,
          },
        );
      });
    },
    [getValues, move, setValue],
  );

  const onSocialAlignmentFormHandler: SubmitHandler<SocialAlignmentForm> = (
    data,
  ) => {
    mutate(data);
  };

  return (
    <PlaygroundFlowContainer>
      {modal && actionType === "create" && (
        <GameCompletedModal
          open={modal}
          step={6}
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

                  <DragDropProvider onDragEnd={handleDragEnd}>
                    <ul className="grow w-full flex flex-col items-center self-start gap-3">
                      {fields.map((field, index) => (
                        <SortableSocialAlignmentItem
                          key={field.id}
                          id={field.id}
                          index={index}
                          title={field.title}
                          imageUrl={field.imageUrl}
                        />
                      ))}
                    </ul>
                  </DragDropProvider>
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
