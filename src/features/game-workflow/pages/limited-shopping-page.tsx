import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getFoodGroupsCategories } from "../api/past-week-intake.api";
import {
  addShopping,
  getFreeShoppings,
  getLimitedShopping,
} from "../api/shopping.api";
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
import FoodGroupItem from "../components/food-group-item";
import Button from "@/shared/base-components/button";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaCheck } from "react-icons/fa6";
import ScoreBar from "../components/shopping/limited-shopping/score-bar";
import { useLocation, useNavigate } from "react-router-dom";
import type { Category } from "../api/category.types";
import type { FreeShopping, LimitedShopping } from "../api/shopping.types";
import ShoppingCardDrawer from "../components/shopping/shopping-card-drawer";
import FoodGroupQuantityDrawer from "../components/shopping/food-group-quantity-drawer";
import type { ParametersType } from "../api/food-group.types";
import FoodGroupsCategoryAccordion from "../components/food-groups-category-accordion";

const Dmax = {
  price: 8.582970188,
  health: 14.33988166,
  environment: 22.87965138,
  available: 20.64724176,
};

const clampPercent = (value: number) => Math.min(Math.max(value, 0), 100);

const getUsedPercent = (value: number, max: number) =>
  max > 0 ? clampPercent((value / max) * 100) : 0;

const LimitedShoppingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [cartOpen, setCartOpen] = useState(false);
  const [foodGroupQuantityDrawer, setFoodGroupQuantityDrawer] = useState<{
    open: boolean;
    data: {
      foodGroupId: number;
      imageUrl: string;
      title: string;
      unit: string;
      value: number;
      cost: ParametersType;
    };
  }>({
    open: false,
    data: {
      foodGroupId: -1,
      imageUrl: "",
      title: "",
      unit: "",
      value: 0,
      cost: {
        price: 0,
        health: 0,
        environment: 0,
        available: 0,
      },
    },
  });

  const prevItemsRef = useRef<Record<number, number>>({});

  const actionType = state?.actionType ?? undefined;

  const { data: limitedShoppings, isLoading: isLimitedShoppingLoading } =
    useQuery<LimitedShopping[]>({
      queryKey: ["limitedShopping"],
      queryFn: getLimitedShopping,
      enabled: actionType !== "create",
      staleTime: Infinity,
      gcTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const { data: freeShoppingData, isLoading: isFreeShoppingLoading } = useQuery<
    FreeShopping[]
  >({
    queryKey: ["freeShoppings"],
    queryFn: getFreeShoppings,
    enabled: actionType === "create",
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const {
    data: foodGroupsCategories,
    isLoading: isFoodGroupsCategoriesLoading,
  } = useQuery<Category[]>({
    queryKey: ["foodGroupsCategories"],
    queryFn: getFoodGroupsCategories,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const isLoading =
    isFoodGroupsCategoriesLoading ||
    (actionType === "create"
      ? isFreeShoppingLoading
      : isLimitedShoppingLoading);

  const foodGroups = useMemo(
    () => foodGroupsCategories?.flatMap((category) => category.foodGroups),
    [foodGroupsCategories],
  );

  const foodGroupById = useMemo(
    () =>
      new Map((foodGroups ?? []).map((foodGroup) => [foodGroup.id, foodGroup])),
    [foodGroups],
  );

  const formValues = useMemo<ShoppingForm>(() => {
    if (actionType === "create") {
      return {
        items: (freeShoppingData ?? []).map((item) => ({
          foodGroupId: item.foodGroupId,
          imageUrl: item.foodGroup.properties.imageUrl,
          title: item.foodGroup.title,
          value: item.value,
          unit: item.foodGroup.properties.unit,
          positionPrice: 0,
          positionHealth: 0,
          positionEnvironment: 0,
          positionAvailable: 0,
          importancePrice: 0,
          importanceHealth: 0,
          importanceEnvironment: 0,
          importanceAvailable: 0,
        })),
      };
    }

    return {
      items: (limitedShoppings ?? []).map((item) => ({
        foodGroupId: item.foodGroupId,
        imageUrl: item.foodGroup.properties.imageUrl,
        title: item.foodGroup.title,
        value: item.value,
        unit: item.foodGroup.properties.unit,
        positionPrice: item.positionPrice,
        positionHealth: item.positionHealth,
        positionEnvironment: item.positionEnvironment,
        positionAvailable: item.positionAvailable,
        importancePrice: item.importancePrice,
        importanceHealth: item.importanceHealth,
        importanceEnvironment: item.importanceEnvironment,
        importanceAvailable: item.importanceAvailable,
      })),
    };
  }, [actionType, freeShoppingData, limitedShoppings]);

  const method = useForm<ShoppingForm>({ values: formValues });
  const { control, getValues, setValue, handleSubmit } = method;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    name: "items",
    control,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addShopping,
    onSuccess: async () => {
      if (actionType === "create") {
        setModal(true);
      } else {
        toast.success("ویرایش مرحله ششم با موفقیت انجام شد");
        navigate("/game-workflow");
      }
      queryClient.invalidateQueries({ queryKey: ["roadMapList"] });
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const { selectedFoodGroupIds, itemValueByFoodGroupId } = useMemo(() => {
    const selectedIds = new Set<number>();
    const values = new Map<number, number>();

    (items ?? []).forEach((item) => {
      selectedIds.add(item.foodGroupId);
      values.set(item.foodGroupId, item.value);
    });

    return {
      selectedFoodGroupIds: selectedIds,
      itemValueByFoodGroupId: values,
    };
  }, [items]);

  const scoreBars = useMemo(() => {
    const totals = {
      price: 0,
      health: 0,
      environment: 0,
      available: 0,
    };

    for (const item of items ?? []) {
      if (item.value <= 0) continue;

      const score = foodGroupById.get(item.foodGroupId)?.properties.score;

      if (!score) continue;

      totals.price += item.value * score.price;
      totals.health += item.value * score.health;
      totals.environment += item.value * score.environment;
      totals.available += item.value * score.available;
    }

    const used = {
      price: getUsedPercent(totals.price, Dmax.price),
      health: getUsedPercent(totals.health, Dmax.health),
      environment: getUsedPercent(totals.environment, Dmax.environment),
      available: getUsedPercent(totals.available, Dmax.available),
    };

    return {
      health: used.health,
      price: 100 - used.price,
      environment: 100 - used.environment,
      available: 100 - used.available,
    };
  }, [items, foodGroupById]);

  const onAddFoodGroupHandler = useCallback(
    (
      foodGroupId: number,
      imageUrl: string,
      title: string,
      value: number,
      unit: string,
      cost: ParametersType,
    ) => {
      const currentItem = getValues("items").find(
        (item) => item.foodGroupId === foodGroupId,
      );

      if (currentItem) {
        return;
      }

      setFoodGroupQuantityDrawer({
        open: true,
        data: {
          foodGroupId,
          imageUrl,
          title,
          unit,
          value,
          cost,
        },
      });
    },
    [getValues],
  );

  const onOpenFoodGroupQuantityDrawerHandler = useCallback(
    (
      foodGroupId: number,
      imageUrl: string,
      title: string,
      unit: string,
      cost: ParametersType,
    ) => {
      if (cartOpen) return;

      const currentItem = getValues("items").find(
        (item) => item.foodGroupId === foodGroupId,
      );

      if (!currentItem) return;

      setFoodGroupQuantityDrawer({
        open: true,
        data: {
          foodGroupId,
          title,
          imageUrl,
          unit,
          value: currentItem.value,
          cost,
        },
      });
    },
    [cartOpen, getValues],
  );

  const onConfirmFoodGroupQuantityHandler = useCallback(
    (foodGroupId: number, value: number) => {
      const currentItems = getValues("items");

      const itemIndex = currentItems.findIndex(
        (item) => item.foodGroupId === foodGroupId,
      );

      /* Edit */
      if (itemIndex !== -1) {
        setValue(`items.${itemIndex}.value`, value, {
          shouldDirty: true,
          shouldTouch: true,
        });

        return;
      }

      /* Create */
      const { data } = foodGroupQuantityDrawer;

      if (data.foodGroupId !== foodGroupId) {
        return;
      }

      append({
        foodGroupId: data.foodGroupId,
        imageUrl: data.imageUrl,
        title: data.title,
        value,
        unit: data.unit,
      });
    },
    [append, foodGroupQuantityDrawer, getValues, setValue],
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

      const score = foodGroupById.get(item.foodGroupId)?.properties.score;
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
    [foodGroupById],
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
    mutate({ data, game: "limited-shopping" });

  return (
    <PlaygroundFlowContainer>
      {modal && actionType === "create" && (
        <GameCompletedModal
          open={modal}
          step={5}
          nextGameLink="/game-workflow/social-alignment"
        />
      )}
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <ul className="w-full shrink-0 flex flex-col items-center justify-start gap-2 mt-2">
            <ScoreBar type="health" percent={scoreBars.health} />

            <ScoreBar type="price" percent={scoreBars.price} />

            <ScoreBar type="available" percent={scoreBars.available} />

            <ScoreBar type="environment" percent={scoreBars.environment} />
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
                    <FoodGroupsCategoryAccordion
                      name="shopping"
                      key={category.id}
                      title={category.title}
                      color={category.properties.color}
                      selectedItemCount={
                        category.foodGroups.filter((foodGroup) =>
                          selectedFoodGroupIds.has(foodGroup.id),
                        ).length
                      }
                      open={accordionOpen === category.id}
                      onToggle={() =>
                        setAccordionOpen((prev) =>
                          prev === category.id ? null : category.id,
                        )
                      }
                    >
                      {(category.foodGroups || []).map((foodGroup) => (
                        <FoodGroupItem
                          key={foodGroup.id}
                          name="shopping"
                          foodGroup={foodGroup}
                          itemIndex={indexByFoodGroupId.get(foodGroup.id) ?? -1}
                          value={itemValueByFoodGroupId.get(foodGroup.id)}
                          handleAddFoodGroup={onAddFoodGroupHandler}
                          handleOpenFoodGroupQuantityDrawer={
                            onOpenFoodGroupQuantityDrawerHandler
                          }
                        />
                      ))}
                    </FoodGroupsCategoryAccordion>
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
            title="سبد"
            itemCount={items.length > 0 ? items.length : 0}
            icon={
              <HiOutlineShoppingBag
                className="compact:text-3xl mobile:text-4xl fold:text-5xl laptop:text-6xl"
                strokeWidth={2}
              />
            }
            itemsGap={10}
            onClick={() => setCartOpen(true)}
          />
          <Button
            type="submit"
            classes="flex-3! btn btn-primary-green shrink-0"
            title="تایید"
            icon={<FaCheck strokeWidth={5} />}
            itemsGap={10}
            disable={
              isPending ||
              !items.some((item) => item.foodGroupId && item.value > 0)
            }
          />
          <FoodGroupQuantityDrawer
            open={foodGroupQuantityDrawer.open}
            onOpenChange={(open) =>
              setFoodGroupQuantityDrawer((prev) => ({
                ...prev,
                open,
              }))
            }
            foodGroupItem={foodGroupQuantityDrawer.data}
            onConfirm={onConfirmFoodGroupQuantityHandler}
          />
          <ShoppingCardDrawer
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
