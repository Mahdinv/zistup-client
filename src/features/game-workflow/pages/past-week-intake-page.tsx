import PlaygroundFlowContainer from "@/app/layouts/playground-flow/playground-flow-container";
import Button from "@/shared/base-components/button";
import ScrollFade from "@/shared/base-components/scroll-fade";
import PastWeekIntakeAccordion from "../components/past-week-intake/past-week-intake-accordion";
import FoodFrequencyHelpBar from "../components/past-week-intake/food-frequency-help-bar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addPastWeekIntake,
  getFoodGroupsCategories,
} from "../api/past-week-intake.api";
import Skeleton from "react-loading-skeleton";
import FoodFrequencyCard from "../components/past-week-intake/food-frequency-card";
import type { Category } from "../api/category.types";
import type { PastWeekIntakeForm } from "../schemas/past-week-intake.schema";
import {
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DoughnutChart from "../components/past-week-intake/doughnut-chart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { normalizeApiError } from "@/shared/api";
import { HiOutlineChevronDown } from "react-icons/hi";

const CHART_CATEGORIES = [
  {
    categoryId: 1,
    categoryTitle: "محرک‌ها",
    color: "#BB6BD9",
  },
  {
    categoryId: 2,
    categoryTitle: "روغن‌ها",
    color: "#FFEE80",
  },
  {
    categoryId: 3,
    categoryTitle: "کربوهیدرات‌",
    color: "#FF9F45",
  },
  {
    categoryId: 4,
    categoryTitle: "پروتئین‌",
    color: "#FF7878",
  },
  {
    categoryId: 5,
    categoryTitle: "فیبرها",
    color: "#2CE57F",
  },
  {
    categoryId: 6,
    categoryTitle: "ترکیبی‌ها",
    color: "#7EBBD0",
  },
];

const PastWeekIntakePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartEndRef = useRef<HTMLDivElement>(null);

  const [isChartVisible, setIsChartVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["foodGroupsCategories"],
    queryFn: getFoodGroupsCategories,
    staleTime: Infinity,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addPastWeekIntake,
    onSuccess: async () => {
      toast.success("رژیم فعلی شما با موفقیت ثبت شد");
      await queryClient.invalidateQueries({
        queryKey: ["roadMapList"],
      });
      navigate("/game-workflow");
    },
    onError: (error) => {
      const apiError = normalizeApiError(error);
      toast.error(apiError.message);
    },
  });

  const formValues = useMemo<PastWeekIntakeForm>(
    () => ({
      items: (data ?? []).flatMap((category: Category) =>
        (category.foodGroups ?? []).map((fg) => ({
          foodGroupId: fg.id,
          categoryId: fg.categoryId,
          value: 0,
          percentUsage: 0,
        })),
      ),
    }),
    [data],
  );

  const method = useForm<PastWeekIntakeForm>({
    values: formValues,
  });

  const { getValues, control, handleSubmit } = method;

  const { replace } = useFieldArray({
    control,
    name: "items",
  });

  const items = useWatch({
    control,
    name: "items",
  });

  const chartData = useMemo(() => {
    return CHART_CATEGORIES.map((category) => {
      const totalPercentUsage = (items ?? []).reduce(
        (sum, item) =>
          sum +
          (item.categoryId === category.categoryId
            ? Number(item.percentUsage)
            : 0),
        0,
      );

      return {
        ...category,
        totalPercentUsage,
      };
    });
  }, [items]);

  useEffect(() => {
    const chartEndElement = chartEndRef.current;

    if (!chartEndElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsChartVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
      },
    );

    observer.observe(chartEndElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToChart = useCallback(() => {
    chartEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  const registeredCount = (items ?? []).filter(
    (item) => Number(item.percentUsage) > 0,
  ).length;

  const handleSetFoodFrequencyValue = useCallback(
    (selectedValue: number, id: number) => {
      const currentItems = getValues("items");

      const updatedItems = currentItems.map((item) =>
        item.foodGroupId === id
          ? {
              ...item,
              value: selectedValue,
            }
          : item,
      );

      const totalSelectedValue = updatedItems.reduce(
        (sum, item) => sum + item.value,
        0,
      );

      const finalItems = updatedItems.map((item) => ({
        ...item,
        percentUsage:
          item.value > 0 && totalSelectedValue > 0
            ? Number(((item.value * 100) / totalSelectedValue).toFixed(2))
            : 0,
      }));

      replace(finalItems);
    },
    [getValues, replace],
  );

  const onRefreshFoodGroupsCategory = useCallback(
    (ids: number[]) => {
      const currentItems = getValues("items");

      const updatedItems = currentItems.map((item) =>
        ids.includes(item.foodGroupId)
          ? {
              ...item,
              value: 0,
              percentUsage: 0,
            }
          : item,
      );

      const totalSelectedValue = updatedItems.reduce(
        (sum, item) => sum + Number(item.value),
        0,
      );

      const finalItems = updatedItems.map((item) => ({
        ...item,
        percentUsage:
          Number(item.value) > 0 && totalSelectedValue > 0
            ? Number(
                ((Number(item.value) * 100) / totalSelectedValue).toFixed(2),
              )
            : 0,
      }));

      replace(finalItems);
    },
    [getValues, replace],
  );

  const onPastWeekIntakeHandler: SubmitHandler<PastWeekIntakeForm> = (data) =>
    mutate(data);

  return (
    <PlaygroundFlowContainer>
      <div className="w-full h-full min-h-0 flex flex-col gap-3">
        <div className="flex-1 min-h-0">
          <ScrollFade>
            <div className="w-full min-h-full flex flex-col gap-3">
              <FoodFrequencyHelpBar />
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
                    key={category.id}
                    title={category.title}
                    color={category.properties.color}
                    onRefreshGroup={() =>
                      onRefreshFoodGroupsCategory(
                        category.foodGroups.map((ff) => ff.id),
                      )
                    }
                  >
                    {(category.foodGroups || []).map((foodGroup) => (
                      <FoodFrequencyCard
                        key={foodGroup.code}
                        foodGroup={foodGroup}
                        valueColor={category.properties.color}
                        value={
                          items?.find(
                            (item) => item.foodGroupId === foodGroup.id,
                          )?.value
                        }
                        onClick={(selectedValue, foodFrequencyId) =>
                          handleSetFoodFrequencyValue(
                            selectedValue,
                            foodFrequencyId,
                          )
                        }
                      />
                    ))}
                  </PastWeekIntakeAccordion>
                ))
              )}
              <div
                ref={chartRef}
                className="w-full bg-darker-blue-300 border border-dark rounded-[30px] p-6"
              >
                <DoughnutChart
                  chartData={chartData}
                  registeredCount={registeredCount}
                />
              </div>
              <div ref={chartEndRef} className="w-full h-px shrink-0" />
            </div>
          </ScrollFade>
        </div>
        <form onSubmit={handleSubmit(onPastWeekIntakeHandler)}>
          {isChartVisible ? (
            <Button
              type="submit"
              classes="btn btn-primary-green shrink-0"
              title="تایید"
              disable={!items.some((item) => item.value > 0) || isPending}
            />
          ) : (
            <Button
              type="button"
              classes="btn btn-primary-green shrink-0"
              title="بررسی نمودار و تایید"
              icon={<HiOutlineChevronDown className="text-4xl" />}
              itemsGap={12}
              onClick={handleScrollToChart}
            />
          )}
        </form>
      </div>
    </PlaygroundFlowContainer>
  );
};

export default PastWeekIntakePage;
