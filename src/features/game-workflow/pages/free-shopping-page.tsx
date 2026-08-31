import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import { FaCheck } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi";
import InventoryBox from "../components/shopping/free-shopping/inventory-box";
import { useCallback, useMemo, useState } from "react";
import ShoppingCard from "../components/shopping/shopping-card";
import { useQuery } from "@tanstack/react-query";
import { getFoodGroupsCategories } from "../api/past-week-intake.api";
import PastWeekIntakeAccordion from "../components/past-week-intake/past-week-intake-accordion";
import Skeleton from "react-loading-skeleton";
import FoodGroupItem from "../components/shopping/food-group-item";
import type { ShoppingForm } from "../schemas/shopping.schema";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

const FreeShoppingPage = () => {
  const [cartOpen, setCartOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["foodGroupsCategories"],
    queryFn: getFoodGroupsCategories,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const method = useForm<ShoppingForm>({ defaultValues: { items: [] } });
  const { control, getValues } = method;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    name: "items",
    control,
  });

  const onAddFoodGroupHandler = useCallback(
    function onAddFoodGroupHandler(
      foodGroupId: number,
      imageUrl: string,
      title: string,
      value: number,
    ) {
      const items = getValues("items") || [];
      if (!items.find((item) => item.foodGroupId === foodGroupId)) {
        append({ foodGroupId, imageUrl, title, value });
      }
    },
    [append, getValues],
  );

  const indexByFoodGroupId = useMemo(() => {
    const m = new Map<number, number>();
    fields.forEach((field, i) => m.set(field.foodGroupId, i));
    return m;
  }, [fields]);

  return (
    <PlaygroundFlowContainer>
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
                (data || []).map((category) => (
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
        <form className="w-full flex flex-row items-center gap-2">
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
            classes="flex-1! btn btn-primary-green shrink-0"
            title="تایید"
            icon={<FaCheck strokeWidth={5} />}
            itemsGap={10}
          />
          <ShoppingCard
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
