import Calendar from "../components/dashboard/calendar";
import DailyCalories from "../components/dashboard/daily-calories";
import DailyWater from "../components/dashboard/daily-water";
import DietAdherence from "../components/dashboard/diet-adherence";
import DietGoalMealSuggestions from "../components/dashboard/diet-goal-meal-suggestions";
import WeeklyProgress from "../components/dashboard/weekly-progress";

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
    </div>
  );
};

export default DashboardPage;
