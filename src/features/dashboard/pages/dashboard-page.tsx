import usePlanDates from "../hooks/use-plan-dates.hook";
import useDietAdherenceQuery from "../hooks/use-diet-adherence-query.hook";
import useCaloriesQuery from "../hooks/use-calories-query.hook";
import useRadarQuery from "../hooks/use-radar-query.hook";
import useNutritionQuery from "../hooks/use-nutrition-query.hook";
import Skeleton from "react-loading-skeleton";
import Button from "@/shared/base-components/button";
import { getApiErrorMessage, isConnectionError } from "@/shared/api/error.helpers";
import useOptimizedDietaryQuery from "@/features/game-workflow/hooks/use-optimized-dietary-query.hook";
import Calendar from "../components/dashboard/calendar";
import DailyCalories from "../components/dashboard/daily-calories";
import DailyPhysicalActivity from "../components/dashboard/daily-physical-activity";
import DailyWater from "../components/dashboard/daily-water";
import DietAdherence from "../components/dashboard/diet-adherence";
import DietGoalMealSuggestions from "../components/dashboard/diet-goal-meal-suggestions";
import WeeklyProgress from "../components/dashboard/weekly-progress";
import ZistupRadar from "../components/dashboard/zistup-radar";
import DetailedMonitoring from "../components/dashboard/detailed-monitoring";
import ZistupRecommendation from "../components/dashboard/zistup-recommendation";
import TodayLoggedMeals from "../components/dashboard/today-logged-meals";
import { formatPlanDateForApi } from "../lib/plan-date.utils";
import { useLayoutEffect } from "react";
import { useQuickAddMealDrawer } from "../hooks/use-quick-add-meal-drawer.hook";
import type { DietMeal } from "../api/types/diet-day.types";

const DashboardPage = () => {
  const dietQuery = useOptimizedDietaryQuery(true);

  const planDates = usePlanDates(
    dietQuery.data?.success
      ? dietQuery.data.data
      : undefined,
  );

  const selectedDate =
    planDates.selectedDate !== null
      ? formatPlanDateForApi(planDates.selectedDate)
      : null;
  const { setDashboardDate } = useQuickAddMealDrawer();
  // Registration endpoints write to today only, including after Tehran midnight.
  const registrationDate =
    planDates.selectedDate === planDates.today ? selectedDate : null;
  useLayoutEffect(() => {
    setDashboardDate(registrationDate);
    return () => setDashboardDate(null);
  }, [registrationDate, setDashboardDate]);

  if (
    dietQuery.isError &&
    (!dietQuery.data || !isConnectionError(dietQuery.error))
  ) {
    return (
      <div className="w-full flex flex-col gap-4" role="alert">
        <p>{getApiErrorMessage(dietQuery.error)}</p>
        <Button
          classes="btn btn-primary-green"
          title="تلاش مجدد"
          onClick={() => void dietQuery.refetch()}
        />
      </div>
    );
  }

  // Successful cached plans are shared with Diets and the generation flow.
  if (
    dietQuery.isPending ||
    !dietQuery.data?.success
  ) {
    return (
      <div
        className="w-full"
        role="status"
        aria-label="در حال دریافت برنامه غذایی"
      >
        <Skeleton height={180} borderRadius={16} />
        <Skeleton height={64} borderRadius={32} />
      </div>
    );
  }

  if (
    !planDates.range ||
    !planDates.navigationRange ||
    planDates.selectedDate === null ||
    selectedDate === null
  ) {
    return <p role="alert">تاریخ یا روزهای برنامه غذایی معتبر نیست.</p>;
  }

  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <WeeklyProgress days={planDates.weeklyDays} />
      <Calendar
        selectedDate={planDates.selectedDate}
        range={planDates.navigationRange}
        onSelectDate={planDates.selectDate}
      />
      <DashboardDayContent
        key={selectedDate}
        date={selectedDate}
        isFuture={planDates.isFuture}
        isToday={planDates.selectedDate === planDates.today}
        meals={planDates.selectedDietDay?.meals}
      />
    </div>
  );
};

// A date owns its queries, sliders and drawers; switching dates resets them together.
const DashboardDayContent = ({
  date,
  isFuture,
  isToday,
  meals,
}: {
  date: string;
  isFuture: boolean;
  isToday: boolean;
  meals: DietMeal[] | undefined;
}) => {
  const queryDate = isFuture ? null : date;
  const adherenceQuery = useDietAdherenceQuery(queryDate);
  const caloriesQuery = useCaloriesQuery(queryDate);
  const radarQuery = useRadarQuery(queryDate);
  const nutritionQuery = useNutritionQuery(queryDate);
  const nutrition =
    nutritionQuery.isFetchedAfterMount && nutritionQuery.data?.success
      ? nutritionQuery.data.data
      : undefined;

  return (
    <>
      <DietAdherence
        isToday={isToday}
        data={
          adherenceQuery.isFetchedAfterMount && adherenceQuery.data?.success
            ? (adherenceQuery.data.data ?? undefined)
            : undefined
        }
        isLoading={!isFuture && !adherenceQuery.isFetchedAfterMount}
        error={adherenceQuery.error}
        onRetry={() => void adherenceQuery.refetch()}
      />
      <DietGoalMealSuggestions meals={meals} registrationDisabled={!isToday} />
      <div className="w-full flex flex-row items-stretch gap-3">
        <DailyCalories
          data={
            caloriesQuery.isFetchedAfterMount && caloriesQuery.data?.success
              ? (caloriesQuery.data.data ?? undefined)
              : undefined
          }
          isLoading={!isFuture && !caloriesQuery.isFetchedAfterMount}
          error={caloriesQuery.error}
          onRetry={() => void caloriesQuery.refetch()}
        />
        <DailyWater date={date} readOnly={isFuture} />
      </div>
      <DailyPhysicalActivity
        date={date}
        isFuture={isFuture}
        isToday={isToday}
      />
      <ZistupRadar
        data={
          radarQuery.isFetchedAfterMount && radarQuery.data?.success
            ? (radarQuery.data.data ?? undefined)
            : undefined
        }
        isLoading={!isFuture && !radarQuery.isFetchedAfterMount}
        error={radarQuery.error}
        onRetry={() => void radarQuery.refetch()}
      />
      <DetailedMonitoring
        nutrients={nutrition?.nutrients ?? undefined}
        isLoading={!isFuture && !nutritionQuery.isFetchedAfterMount}
        error={nutritionQuery.error}
        onRetry={() => void nutritionQuery.refetch()}
      />
      <ZistupRecommendation advices={nutrition?.advices ?? undefined} />
      <TodayLoggedMeals date={date} isFuture={isFuture} isToday={isToday} />
    </>
  );
};

export default DashboardPage;
