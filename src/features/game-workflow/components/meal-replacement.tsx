import BaseDrawer from "@/shared/base-components/base-drawer";
import type { MealType } from "../api/meal-alternatives.api";
import useMealAlternativesQuery from "../hooks/use-meal-alternatives-query.hook";
import type { DietFoodDto } from "@/features/dashboard/api/dto/diet-day.dto";
import MealReplacementFoodCard from "./meal-replacement-food-card";
import MealReplacementSkeleton from "./meal-replacement-skeleton";
import { PiXCircle } from "react-icons/pi";
import useSelectMealAlternativeMutation from "../hooks/use-select-meal-alternative-mutation.hook";
import type { MealSelection } from "../api/meal-alternatives.api";
import { normalizeApiError } from "@/shared/api";
import { toast } from "sonner";

export default function MealReplacement({
  open,
  onOpenChange,
  meal,
  day,
  currentFood,
  dayNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meal: MealType;
  day: string;
  currentFood?: DietFoodDto | null;
  dayNumber: number;
}) {
  const { data, isPending, isError, isFetching, refetch } =
    useMealAlternativesQuery(meal, open);
  const alternatives = Array.isArray(data?.data?.alternatives)
    ? data.data.alternatives.filter((food) => food != null)
    : [];
  const mealLabel = { breakfast: "صبحانه", lunch: "ناهار", dinner: "شام" }[
    meal
  ];
  const selection = useSelectMealAlternativeMutation();
  const selectedFoodId = selection.variables?.meals[0]?.id;

  const handleSelect = (food: Partial<DietFoodDto>) => {
    if (selection.isPending) return;

    const id = food.food_id ?? food.foodId;
    const value = food.quantity?.grams;
    if (id == null || food.type == null || value == null) return;

    const payload: MealSelection = {
      diet: "zistpa",
      meals: [
        {
          day: dayNumber,
          meal,
          id,
          type: food.type,
          value,
        },
      ],
    };
    selection.mutate(payload, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => toast.error(normalizeApiError(error).message),
    });
  };

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={`انتخاب جایگزین برای ${mealLabel} ${day}`}
      theme="dark"
      closeIcon={<PiXCircle aria-hidden="true" className="size-6" />}
      className="dark:bg-[#21262D] dark:text-[#DEE2E0] [--scroll-fade-color:#21262D] dark:[--scroll-fade-color:#21262D] [&>div>header]:border-darker-blue-100 [&>div>header]:px-4 [&>div>header]:pb-4 **:data-[slot=drawer-title]:text-[16px] mobile:**:data-[slot=drawer-title]:text-[18px] fold:**:data-[slot=drawer-title]:text-[20px] laptop:**:data-[slot=drawer-title]:text-[22px] **:data-[slot=drawer-title]:leading-[1.2] **:data-[slot=drawer-close]:size-6 **:data-[slot=drawer-close]:text-[#3F5E68] **:data-[slot=base-drawer-body]:p-4"
    >
      <div className="font-peyda text-[13px] mobile:text-[14px] fold:text-[16px] laptop:text-[18px]">
        {!isError && data?.success !== false && (
          <p className="mb-4 text-center font-peyda font-bold text-[#65A2B5]">
            یکی از پیشنهادهای زیستاپ رو انتخاب کن
          </p>
        )}
        {isPending && <MealReplacementSkeleton />}
        {(isError || data?.success === false) && (
          <div role="alert" className="flex flex-wrap items-center gap-2">
            <span>دریافت غذاهای جایگزین ناموفق بود.</span>
            <button
              type="button"
              disabled={isFetching}
              onClick={() => void refetch()}
              className="text-green-400 underline disabled:opacity-50"
            >
              تلاش دوباره
            </button>
          </div>
        )}
        {!isPending && !isError && data?.success !== false && (
          <>
            {alternatives.length === 0 ? (
              <p role="status" className="text-center">
                غذای جایگزینی برای این وعده موجود نیست.
              </p>
            ) : (
              <div className="flex min-w-0 flex-col gap-2">
                {alternatives.map((food, index) => {
                  const foodId = food.foodId ?? food.food_id;
                  const currentId = currentFood?.foodId ?? currentFood?.food_id;
                  const selected =
                    !!currentFood &&
                    (food.id && currentFood.id
                      ? food.id === currentFood.id
                      : foodId != null &&
                        currentId != null &&
                        foodId === currentId);
                  return (
                    <MealReplacementFoodCard
                      key={food.id ?? foodId ?? index}
                      food={food}
                      selected={selected}
                      loading={
                        selection.isPending &&
                        selectedFoodId === (food.food_id ?? food.foodId)
                      }
                      onSelect={() => handleSelect(food)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </BaseDrawer>
  );
}
