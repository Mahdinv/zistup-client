import { cn } from "@/shared/lib/utils";
import { MEAL_ICONS } from "../../constants/meal-icons.constants";

type Props = {
  name: keyof typeof MEAL_ICONS;
  className?: string;
};

export default function MealIcon({ name, className }: Props) {
  const { icon: Icon, classes } = MEAL_ICONS[name];
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        className,
      )}
    >
      <Icon aria-hidden="true" focusable="false" className={classes} />
    </span>
  );
}
