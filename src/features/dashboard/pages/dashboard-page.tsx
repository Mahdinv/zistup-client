import usePlanDates from "../hooks/use-plan-dates.hook";
import Skeleton from "react-loading-skeleton";
import Button from "@/shared/base-components/button";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
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

const DashboardPage = () => {
  const dietQuery = useOptimizedDietaryQuery(true, {
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
  });

  const planDates = usePlanDates(
    dietQuery.isFetchedAfterMount && dietQuery.data?.success
      ? dietQuery.data.data
      : undefined,
  );

  const meals = planDates.selectedDietDay?.meals;

  if (dietQuery.isError) {
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

  // A cached result from the generation flow must not be shown on entry.
  if (
    !dietQuery.isFetchedAfterMount ||
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

  if (!planDates.range || planDates.selectedDate === null) {
    return <p role="alert">تاریخ یا روزهای برنامه غذایی معتبر نیست.</p>;
  }

  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <WeeklyProgress days={planDates.weeklyDays} />
      <Calendar
        selectedDate={planDates.selectedDate}
        range={planDates.range}
        onSelectDate={planDates.selectDate}
      />
      <DietAdherence />
      <DietGoalMealSuggestions meals={meals} />
      <div className="w-full flex flex-row items-stretch gap-3">
        <DailyCalories />
        <DailyWater />
      </div>
      <DailyPhysicalActivity />
      <ZistupRadar />
      <DetailedMonitoring />
      <ZistupRecommendation />
      <TodayLoggedMeals />
    </div>
  );
};

export default DashboardPage;
