import Button from "@/shared/base-components/button";
import { getApiErrorMessage } from "@/shared/api/error.helpers";
import type useFoodInfoQuery from "../../hooks/use-food-info-query.hook";
import type { FlowState } from "../../api/types/quick-add-meal.types";
import type { FlowAction } from "../../lib/quick-add-meal/quick-add-meal.state";
import FoodDetails from "./food-details";
export default function FoodDetailsResource({
  state,
  resource,
  dispatch,
}: {
  state: FlowState;
  resource: ReturnType<typeof useFoodInfoQuery>;
  dispatch: (action: FlowAction) => void;
}) {
  if (resource.isError)
    return (
      <div
        role="alert"
        className="flex min-h-66 flex-col items-center justify-center gap-4 text-center"
      >
        <p>{getApiErrorMessage(resource.error)}</p>
        <Button
          classes="btn btn-primary-green"
          title="تلاش مجدد"
          onClick={() => void resource.refetch()}
        />
      </div>
    );
  if (!resource.data)
    return (
      <div
        role="status"
        aria-label="در حال دریافت اطلاعات غذا"
        className="space-y-4"
      >
        <div className="h-36 animate-pulse rounded-3xl bg-blue-200 dark:bg-darker-blue-400" />
        <div className="h-48 animate-pulse rounded-3xl bg-blue-200 dark:bg-darker-blue-400" />
      </div>
    );
  return <FoodDetails state={state} food={resource.data} dispatch={dispatch} />;
}
