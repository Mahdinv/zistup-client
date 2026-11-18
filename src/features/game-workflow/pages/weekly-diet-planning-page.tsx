import useWeeklyDietPlanQuery from "../hooks/use-weekly-diet-plan-query.hook";

const WeeklyDietPlanningPage = () => {
  useWeeklyDietPlanQuery();

  return <h1>weekly-diet-planning</h1>;
};

export default WeeklyDietPlanningPage;
