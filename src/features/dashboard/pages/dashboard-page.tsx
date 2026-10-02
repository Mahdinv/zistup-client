import Calendar from "../components/dashboard/calendar";
import DietAdherence from "../components/dashboard/diet-adherence/diet-adherence";
import WeeklyProgress from "../components/dashboard/weekly-progress";

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <WeeklyProgress />
      <Calendar />
      <DietAdherence />
    </div>
  );
};

export default DashboardPage;
