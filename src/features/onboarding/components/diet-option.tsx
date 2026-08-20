import type { AccountFlowNavigationState } from "@/app/layouts/account-flow/account-flow.types";
import { PiCaretLeftBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import type { Diet } from "../api/diet.types";

const DietOption = ({
  routeState,
}: {
  routeState: AccountFlowNavigationState<Diet>;
}) => {
  const charNumToSlice =
    routeState.data!.title === "مدیترانه ای"
      ? 41
      : routeState.data!.title === "اتکینز"
        ? 29
        : routeState.data!.title === "کتوژنیک"
          ? 38
          : routeState.data!.title === "گیاه‌خواری"
            ? 27
            : routeState.data!.title === "فستینگ"
              ? 33
              : routeState.data!.title === "وگان"
                ? 24
                : 0;

  return (
    <li className="w-full">
      <Link
        to={`${routeState.data!.id}`}
        state={routeState}
        className="w-full 
                 bg-blue-900 
                 hover:bg-darker-blue-100 
                 active:bg-darker-blue-100 
                 text-white 
                 font-peyda 
                 border 
                 border-blue-400 
                 rounded-sm 
                 px-4 
                 py-2 
                 select-none 
                 cursor-pointer 
                 flex 
                 flex-row 
                 justify-between 
                 items-center"
      >
        <div className="flex flex-col justify-start items-start gap-1">
          <h3 className="compact:text-lg fold:text-xl laptop:text-2xl font-medium">
            {routeState.data!.title}{" "}
            {routeState.data!.subTitle && (
              <span> ({routeState.data!.subTitle})</span>
            )}
          </h3>
          <h4 className="compact:text-xs fold:text-sm laptop:text-base font-medium">
            {routeState.data!.desc.slice(0, charNumToSlice)}
          </h4>
        </div>
        <PiCaretLeftBold className="text-blue-400 text-4xl" />
      </Link>
    </li>
  );
};

export default DietOption;
