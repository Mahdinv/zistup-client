import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFoodGroupsCategories } from "../api/past-week-intake.api";
import { addShopping, getFreeShopping } from "../api/shopping.api";
import { normalizeApiError } from "@/shared/api";
import { toast } from "sonner";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import type { ShoppingForm } from "../schemas/shopping.schema";
import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import GameCompletedModal from "../components/game-completed-modal";
import ScrollFade from "@/shared/base-components/scroll-fade";
import Skeleton from "react-loading-skeleton";
import PastWeekIntakeAccordion from "../components/past-week-intake/past-week-intake-accordion";
import FoodGroupItem from "../components/shopping/food-group-item";
import Button from "@/shared/base-components/button";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import ShoppingCard from "../components/shopping/shopping-card";
import ScoreBar from "../components/shopping/limited-shopping/score-bar";

const Dmax = {
  price: 36.78415795,
  health: 61.45663568,
  environment: 98.05564877,
  available: 88.48817898,
};

const LimitedShoppingPage = () => {
  const [modal, setModal] = useState(false);
  const queryClient = useQueryClient();
  const [cartOpen, setCartOpen] = useState(false);
  const prevItemsRef = useRef<Record<number, number>>({});

  const { data: foodGroupsCategories, isLoading: isFoodGroupsLoading } =
    useQuery({
      queryKey: ["foodGroupsCategories"],
      queryFn: getFoodGroupsCategories,
      staleTime: Infinity,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const { data: freeShoppingData, isLoading: isFreeShoppingLoading } = useQuery(
    {
      queryKey: ["free-shopping-data"],
      queryFn: getFreeShopping,
      enabled: !!foodGroupsCategories,
      staleTime: Infinity,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const isLoading = isFoodGroupsLoading || isFreeShoppingLoading;

  const { mutate, isPending } = useMutation({
    mutationFn: addShopping,
    onSuccess: async () => {
      setModal(true);
      queryClient.invalidateQueries({ queryKey: ["roadMapList"] });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const foodGroups = useMemo(
    () => foodGroupsCategories?.flatMap((category) => category.foodGroups),
    [foodGroupsCategories],
  );

  const formValues = useMemo<ShoppingForm>(() => {
    const items = (freeShoppingData?.data?.items ?? [])
      .map((freeShoppingItem: { foodGroupId: number; value: number }) => {
        const foodGroup = (foodGroups ?? []).find(
          (foodGroup) => foodGroup.id === freeShoppingItem.foodGroupId,
        );
        if (!foodGroup) return null;

        return {
          foodGroupId: freeShoppingItem.foodGroupId,
          imageUrl: foodGroup.properties.imageUrl,
          title: foodGroup.title,
          value: freeShoppingItem.value,
          positionPrice: 0,
          positionHealth: 0,
          positionEnvironment: 0,
          positionAvailable: 0,
          importancePrice: 0,
          importanceHealth: 0,
          importanceEnvironment: 0,
          importanceAvailable: 0,
        };
      })
      .filter((item: ShoppingForm) => item !== null);

    return { items };
  }, [foodGroups, freeShoppingData?.data?.items]);

  const method = useForm<ShoppingForm>({ values: formValues });
  const { control, getValues, handleSubmit } = method;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({ name: "items", control });

  const onAddFoodGroupHandler = useCallback(
    function onAddFoodGroupHandler(
      foodGroupId: number,
      imageUrl: string,
      title: string,
      value: number,
    ) {
      const items = getValues("items") || [];
      if (!items.find((item) => item.foodGroupId === foodGroupId))
        append({ foodGroupId, imageUrl, title, value });
    },
    [append, getValues],
  );

  const indexByFoodGroupId = useMemo(() => {
    const m = new Map<number, number>();
    fields.forEach((field, i) => m.set(field.foodGroupId, i));
    return m;
  }, [fields]);

  const calculatePositionI = useCallback(
    (item: { foodGroupId: number; value: number }) => {
      if (item.value <= 0) {
        return {
          positionPrice: 0,
          positionHealth: 0,
          positionEnvironment: 0,
          positionAvailable: 0,
          importancePrice: 0,
          importanceHealth: 0,
          importanceEnvironment: 0,
          importanceAvailable: 0,
        };
      }

      const score = (foodGroups ?? []).find((fg) => fg.id === item.foodGroupId)
        ?.properties.score;
      if (!score) return;

      const Sprice = item.value * score.price;
      const Shealth = item.value * score.health;
      const Senvironment = item.value * score.environment;
      const Savailable = item.value * score.available;

      const Qprice = 1 - Sprice / Dmax.price;
      const Qhealth = 1 - Shealth / Dmax.health;
      const Qenvironment = 1 - Senvironment / Dmax.environment;
      const Qavailable = 1 - Savailable / Dmax.available;

      const positionPrice = Number(
        (1 - Math.exp((Sprice / Dmax.price) * -3)).toFixed(4),
      );
      const positionHealth = Number(
        (1 - Math.exp((Shealth / Dmax.health) * -3)).toFixed(4),
      );
      const positionEnvironment = Number(
        (1 - Math.exp((Senvironment / Dmax.environment) * -3)).toFixed(4),
      );
      const positionAvailable = Number(
        (1 - Math.exp((Savailable / Dmax.available) * -3)).toFixed(4),
      );

      const zigmaQ = Qprice + Qhealth + Qenvironment + Qavailable;

      const importancePrice = Number((Qprice / zigmaQ).toFixed(4));
      const importanceHealth = Number((Qhealth / zigmaQ).toFixed(4));
      const importanceEnvironment = Number((Qenvironment / zigmaQ).toFixed(4));
      const importanceAvailable = Number((Qavailable / zigmaQ).toFixed(4));

      return {
        positionPrice,
        positionHealth,
        positionEnvironment,
        positionAvailable,
        importancePrice,
        importanceHealth,
        importanceEnvironment,
        importanceAvailable,
      };
    },
    [foodGroups],
  );

  useEffect(() => {
    if (!items || items.length === 0) return;

    let changed = false;

    const newItems = items.map((item) => {
      const prevValue = prevItemsRef.current[item.foodGroupId];
      if (prevValue === item.value) return item;

      const result = calculatePositionI(item);
      prevItemsRef.current[item.foodGroupId] = item.value;

      if (!result) return item;

      changed = true;
      return { ...item, ...result };
    });

    if (changed) replace(newItems);
  }, [items, replace, calculatePositionI]);

  const onShoppingFormHandler: SubmitHandler<ShoppingForm> = (data) =>
    mutate(data);

  return (
    <PlaygroundFlowContainer>
      {modal && (
        <GameCompletedModal
          open={modal}
          step={6}
          nextGameLink="/game-workflow/limited-shopping"
        />
      )}
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <ul className="w-full shrink-0 flex flex-col items-center justify-start gap-2 mt-2">
            <ScoreBar
              type="health"
              Dmax={Dmax.health}
              totalScore={items.reduce(
                (a, item) => a + (item.positionHealth ?? 0),
                0,
              )}
            />
            <ScoreBar
              type="price"
              Dmax={Dmax.price}
              totalScore={items.reduce(
                (a, item) => a + (item.positionPrice ?? 0),
                0,
              )}
            />
            <ScoreBar
              type="available"
              Dmax={Dmax.available}
              totalScore={items.reduce(
                (a, item) => a + (item.positionAvailable ?? 0),
                0,
              )}
            />
            <ScoreBar
              type="environment"
              Dmax={Dmax.environment}
              totalScore={items.reduce(
                (a, item) => a + (item.positionEnvironment ?? 0),
                0,
              )}
            />
          </ul>
          <div className="flex-1 min-h-0">
            <ScrollFade>
              <div className="w-full flex flex-col items-center gap-3">
                {isLoading ? (
                  <Skeleton
                    width="100%"
                    height={48}
                    count={4}
                    borderRadius={20}
                    containerClassName="w-full flex flex-col gap-0"
                  />
                ) : (
                  (foodGroupsCategories || []).map((category) => (
                    <PastWeekIntakeAccordion
                      name="shopping"
                      key={category.id}
                      title={category.title}
                      color={category.properties.color}
                      selectedItemCount={
                        category.foodGroups.filter((foodGroup) =>
                          items?.some(
                            (item) => item.foodGroupId === foodGroup.id,
                          ),
                        ).length || 0
                      }
                    >
                      {(category.foodGroups || []).map((foodGroup) => (
                        <FoodGroupItem
                          key={foodGroup.id}
                          name="limited-shopping"
                          foodGroup={foodGroup}
                          control={control}
                          itemIndex={indexByFoodGroupId.get(foodGroup.id) ?? -1}
                          handleAddFoodGroup={onAddFoodGroupHandler}
                        />
                      ))}
                    </PastWeekIntakeAccordion>
                  ))
                )}
              </div>
            </ScrollFade>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onShoppingFormHandler)}
          className="w-full flex flex-row items-center gap-2"
        >
          <Button
            type="button"
            classes="flex-1! btn btn-outline-green shrink-0"
            title="بررسی سبد"
            itemCount={items.length > 0 ? items.length : 0}
            icon={
              <HiOutlineShoppingBag
                className="compact:text-2xl mobile:text-3xl fold:text-4xl laptop:text-5xl"
                strokeWidth={2}
              />
            }
            itemsGap={10}
            onClick={() => setCartOpen(true)}
          />
          <Button
            type="submit"
            classes="flex-1! btn btn-primary-green shrink-0"
            title="تایید"
            icon={<FaCheck strokeWidth={5} />}
            itemsGap={10}
            disable={
              isPending ||
              !items.some((item) => item.foodGroupId && item.value > 0)
            }
          />
          <ShoppingCard
            open={cartOpen}
            onOpenChange={setCartOpen}
            ref={prevItemsRef}
            shoppingItems={items}
            name="limited-shopping"
            removeHandle={remove}
          />
        </form>
      </div>
    </PlaygroundFlowContainer>
  );
};

export default LimitedShoppingPage;
