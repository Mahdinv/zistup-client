import Calendar from "../components/dashboard/calendar";
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
    </div>
  );
};

export default DashboardPage;
