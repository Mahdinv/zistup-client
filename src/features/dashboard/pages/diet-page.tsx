import CurrentDiet from "../components/diets/current-diet";
import TargetDiet from "../components/diets/target-diet";

const DietPage = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-4">
      <CurrentDiet />
      <div className="w-full bg-blue-200 dark:bg-darker-blue-200 border border-gray-100 dark:border-dark rounded-lg px-2 py-1.25 flex flex-row items-center justify-center">
        <div className="flex-1 font-peyda font-bold compact:text-sm mobile:text-base fold:text-lg laptop:text-xl p-2.5 flex justify-center">
          اهداف رژیم
        </div>
        <div className="flex-1 font-peyda font-bold bg-green-500 text-black rounded-xs compact:text-sm mobile:text-base fold:text-lg laptop:text-xl p-2 flex justify-center">
          رژیم هدف
        </div>
      </div>
      <TargetDiet />
    </div>
  );
};

export default DietPage;
