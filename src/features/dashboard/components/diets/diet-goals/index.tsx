import { useState } from "react";
import type { Category } from "@/features/game-workflow/api/category.types";
import FoodGroupsCategoryAccordion from "@/features/game-workflow/components/food-groups-category-accordion";
import FoodGroupItem from "./food-group-item";
import useDietsQuery from "../../../hooks/use-diets-query.hook";
import Skeleton from "react-loading-skeleton";
import Button from "@/shared/base-components/button";
import { getApiErrorMessage } from "@/shared/api/error.helpers";

export default function DietGoals() {
  const dietQuery = useDietsQuery();

  if (dietQuery.data) {
    return <DietGoalCategories categories={dietQuery.data.categories} />;
  }

  if (dietQuery.isError) {
    return (
      <div role="alert" className="flex flex-col gap-3">
        <p>{getApiErrorMessage(dietQuery.error)}</p>
        <Button
          title="تلاش مجدد"
          classes="btn btn-primary-green"
          onClick={() => void dietQuery.refetch()}
        />
      </div>
    );
  }

  if (dietQuery.isPending || dietQuery.data === undefined) {
    return (
      <div role="status" aria-label="در حال دریافت اهداف رژیم">
        <Skeleton count={6} height={48} borderRadius={16} className="mb-2" />
      </div>
    );
  }

  return <DietGoalCategories categories={[]} />;
}

function DietGoalCategories({ categories }: { categories: Category[] }) {
  const [openCategory, setOpenCategory] = useState<number | null>(null);

  if (categories.length === 0) {
    return (
      <p className="py-4 text-center font-peyda">
        اهداف رژیم هنوز در دسترس نیست.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {categories.map((category) => (
        <FoodGroupsCategoryAccordion
          key={category.id}
          name="diet-goals"
          title={category.title}
          color={category.properties.color}
          selectedItemCount={category.foodGroups.length}
          open={openCategory === category.id}
          onToggle={() =>
            setOpenCategory((current) =>
              current === category.id ? null : category.id,
            )
          }
        >
          {category.foodGroups.map((foodGroup) => (
            <FoodGroupItem key={foodGroup.id} foodGroup={foodGroup} />
          ))}
        </FoodGroupsCategoryAccordion>
      ))}
    </div>
  );
}
