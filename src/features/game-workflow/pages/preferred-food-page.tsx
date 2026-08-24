import { useQuery } from "@tanstack/react-query";
import { getFoodGroupsCategories } from "../api/past-week-intake.api";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import type { Category } from "../api/category.types";
import { useCallback, useMemo, useState } from "react";
import FoodGroupCard from "../components/preferred-food/food-group-card";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import type { PreferredFoodForm } from "../schemas/preferred-food.schema";
import FoodPlate from "../components/preferred-food/food-plate";
import { stepTitles } from "@/shared/lib/step-titles";
import { FaCheck } from "react-icons/fa6";
import FoodGroupCardSkeleton from "../components/preferred-food/food-group-card-skeleton";

const PreferredFoodPage = () => {
  const [plateState, setPlateState] = useState<{
    plateNum: number;
    actionType: "next" | "back";
  }>({
    plateNum: 1,
    actionType: "next",
  });
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ["foodGroupsCategories"],
    queryFn: getFoodGroupsCategories,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const foodGroups = useMemo(() => {
    return data?.flatMap((category) => category.foodGroups) ?? [];
  }, [data]);

  const formValues = useMemo<PreferredFoodForm>(() => {
    if (!foodGroups.length) {
      return {
        items: [],
      };
    }

    return {
      items: foodGroups.map(() => ({
        foodGroupId: undefined,
        priority: undefined,
      })),
    };
  }, [foodGroups]);

  const method = useForm<PreferredFoodForm>({
    values: formValues,
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { control, handleSubmit } = method;
  const { update } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const selectedCardsEachPlate = items
    .slice((plateState.plateNum - 1) * 4, plateState.plateNum * 4)
    .map((item) => ({
      ...item,
      imageUrl:
        foodGroups.find((foodGroup) => foodGroup.id === item.foodGroupId)
          ?.properties.imageUrl ?? undefined,
    }));

  const onSelectCardHandler = useCallback(
    function onSelectCartHandler(id: number) {
      const currentItems = items;
      const existItemIndex = currentItems.findIndex(
        (item) => item.foodGroupId === id,
      );
      if (existItemIndex !== -1) {
        update(existItemIndex, { foodGroupId: undefined, priority: undefined });
      } else {
        const findIndex = currentItems.findIndex(
          (_, index) =>
            index >= (plateState.plateNum - 1) * 4 &&
            index <= plateState.plateNum * 4 - 1 &&
            items[index].foodGroupId === undefined,
        );
        if (findIndex === -1) return;
        const priority = items.length - findIndex;
        update(findIndex, { foodGroupId: id, priority });
      }
    },
    [items, plateState.plateNum, update],
  );

  function onDisableCardHandler(selectedCardId: number): boolean {
    const isSelectedInCurrentPlate = selectedCardsEachPlate.some(
      (item) => item.foodGroupId === selectedCardId,
    );

    if (isSelectedInCurrentPlate) {
      return false;
    }

    const isSelectedInAnotherPlate = items.some(
      (item) => item.foodGroupId === selectedCardId,
    );

    const hasEmptySlot = selectedCardsEachPlate.some(
      (item) => item.foodGroupId === undefined,
    );

    if (isSelectedInAnotherPlate && hasEmptySlot) {
      return true;
    }

    if (!hasEmptySlot && !isSelectedInCurrentPlate) {
      return true;
    }

    return false;
  }

  const onBackPlateHandler = useCallback(() => {
    setPlateState((prev) => ({
      plateNum: prev.plateNum - 1,
      actionType: "back",
    }));
  }, []);

  const onDeleteItemHandler = useCallback(
    (id: number) => {
      const currentItems = items;
      const existItemIndex = currentItems.findIndex(
        (item) => item.foodGroupId === id,
      );
      if (existItemIndex !== -1) {
        update(existItemIndex, { foodGroupId: undefined, priority: undefined });
      }
    },
    [items, update],
  );

  function onDisableNextPlateHandler(): boolean {
    if (
      items
        .slice(plateState.plateNum * 4, (plateState.plateNum + 1) * 4)
        .some((field) => field.foodGroupId !== undefined)
    ) {
      return false;
    }
    if (selectedCardsEachPlate.every((item) => !!item.foodGroupId)) {
      return false;
    }
    return true;
  }

  const onPreferredFoodFormHandler: SubmitHandler<PreferredFoodForm> = (data) =>
    console.log(data);

  return (
    <PlaygroundFlowContainer>
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <FoodPlate
          plateNum={plateState.plateNum}
          selectedFoodGroup={selectedCardsEachPlate}
          handleBackPlate={onBackPlateHandler}
          handleDeleteItem={onDeleteItemHandler}
        />
        <div className="flex-1 min-h-0">
          <ScrollFade>
            <ul className="w-full grid compact:grid-cols-2 mobile:grid-cols-3 fold:grid-cols-4 tablet:grid-cols-3 items-center gap-2">
              {isLoading
                ? Array.from({ length: 12 }).map((_, index) => (
                    <FoodGroupCardSkeleton key={index} />
                  ))
                : (foodGroups ?? []).map((foodGroup, index) => (
                    <FoodGroupCard
                      key={foodGroup.id}
                      foodGroup={foodGroup}
                      selected={
                        !!items.find(
                          (field) =>
                            field.foodGroupId === foodGroup.id &&
                            field.priority !== undefined,
                        )
                      }
                      disable={onDisableCardHandler(foodGroup.id)}
                      delay={index * 0.035}
                      handleSelectCard={(foodGroupId) =>
                        onSelectCardHandler(foodGroupId)
                      }
                    />
                  ))}
            </ul>
          </ScrollFade>
        </div>
        <form
          onSubmit={handleSubmit(onPreferredFoodFormHandler)}
          className="w-full"
        >
          {plateState.plateNum === 5 ? (
            <Button
              type="submit"
              classes="btn btn-primary-green shrink-0"
              title="تایید"
              icon={<FaCheck strokeWidth={5} />}
              itemsGap={10}
              disable={items.some((item) => item.foodGroupId === undefined)}
            />
          ) : (
            <Button
              type="submit"
              classes="btn btn-primary-green shrink-0"
              title={`تایید و رفتن به بشقاب ${stepTitles[plateState.plateNum]}`}
              disable={onDisableNextPlateHandler()}
              onClick={() => {
                setPlateState((prev) => ({
                  plateNum: prev.plateNum + 1,
                  actionType: "next",
                }));
              }}
            />
          )}
        </form>
      </div>
    </PlaygroundFlowContainer>
  );
};

export default PreferredFoodPage;
