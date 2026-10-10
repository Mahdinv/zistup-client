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
  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <WeeklyProgress />
      <Calendar />
      <DietAdherence />
      <DietGoalMealSuggestions />
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
