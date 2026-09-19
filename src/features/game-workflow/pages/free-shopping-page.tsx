import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi";
import InventoryBox from "../components/shopping/free-shopping/inventory-box";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFoodGroupsCategories } from "../api/past-week-intake.api";
import PastWeekIntakeAccordion from "../components/past-week-intake/past-week-intake-accordion";
import Skeleton from "react-loading-skeleton";
import FoodGroupItem from "../components/shopping/food-group-item";
import type { ShoppingForm } from "../schemas/shopping.schema";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { normalizeApiError } from "@/shared/api";
import { toast } from "sonner";
import GameCompletedModal from "../components/game-completed-modal";
import { addShopping, getFreeShoppings } from "../api/shopping.api";
import { useLocation, useNavigate } from "react-router-dom";
import type { Category } from "../api/category.types";
import type { FreeShopping } from "../api/shopping.types";
import ShoppingCardDrawer from "../components/shopping/shopping-card-drawer";
import FoodGroupQuantityDrawer from "../components/shopping/food-group-quantity-drawer";

const FreeShoppingPage = () => {
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
    };
  }>({
    open: false,
    data: {
      foodGroupId: -1,
      imageUrl: "",
      title: "",
      unit: "",
      value: 0,
    },
  });

  const actionType = state?.actionType ?? undefined;

  const { data: freeShoppings, isLoading: isFreeShoppingLoading } = useQuery<
    FreeShopping[]
  >({
    queryKey: ["freeShopping"],
    queryFn: getFreeShoppings,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: actionType !== "create",
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
    (actionType !== "create" && isFreeShoppingLoading);

  const formValues = useMemo<ShoppingForm>(() => {
    if (freeShoppings === undefined) {
      return {
        items: [],
      };
    }

    return {
      items: (freeShoppings ?? []).flatMap((shopping) => {
        return {
          foodGroupId: shopping.foodGroupId,
          imageUrl: shopping.foodGroup.properties.imageUrl,
          title: shopping.foodGroup.title,
          value: shopping.value,
          unit: shopping.foodGroup.properties.unit,
        };
      }),
    };
  }, [freeShoppings]);

  const method = useForm<ShoppingForm>({ values: formValues });
  const { control, getValues, setValue, handleSubmit } = method;

  const { fields, append, remove } = useFieldArray({
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
        toast.success("ویرایش مرحله پنجم با موفقیت انجام شد");
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

  const onAddFoodGroupHandler = useCallback(
    (
      foodGroupId: number,
      imageUrl: string,
      title: string,
      value: number,
      unit: string,
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
        },
      });
    },
    [getValues],
  );

  const onOpenFoodGroupQuantityDrawerHandler = useCallback(
    (foodGroupId: number, imageUrl: string, title: string, unit: string) => {
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

  const onShoppingFormHandler: SubmitHandler<ShoppingForm> = (data) =>
    mutate({ data, game: "free-shopping" });

  return (
    <PlaygroundFlowContainer>
      {modal && actionType === "create" && (
        <GameCompletedModal
          open={modal}
          step={5}
          nextGameLink="/game-workflow/limited-shopping"
        />
      )}
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0">
          <ScrollFade>
            <div className="w-full flex flex-col items-center gap-3 mt-2">
              <InventoryBox />
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
                        foodGroup={foodGroup}
                        itemIndex={indexByFoodGroupId.get(foodGroup.id) ?? -1}
                        value={itemValueByFoodGroupId.get(foodGroup.id)}
                        handleAddFoodGroup={onAddFoodGroupHandler}
                        handleOpenFoodGroupQuantityDrawer={
                          onOpenFoodGroupQuantityDrawerHandler
                        }
                      />
                    ))}
                  </PastWeekIntakeAccordion>
                ))
              )}
            </div>
          </ScrollFade>
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
            shoppingItems={items}
            name="free-shopping"
            removeHandle={remove}
          />
        </form>
      </div>
    </PlaygroundFlowContainer>
  );
};

export default FreeShoppingPage;
