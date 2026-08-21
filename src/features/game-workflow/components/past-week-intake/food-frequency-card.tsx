import { memo, useState } from "react";
import type { FoodGroup } from "../../api/food-group.types";

type FoodFrequencyCardProps = {
  foodGroup: FoodGroup;
  valueColor: string;
  value: number | undefined;
  onClick: (value: number, foodFrequencyId: number) => void;
};

const FoodFrequencyCard = ({
  foodGroup,
  valueColor,
  value,
  onClick,
}: FoodFrequencyCardProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const options = foodGroup.properties.weeklyConsumptionOption;

  const selectedIndex =
    value !== undefined && value !== 0 ? options.indexOf(value) : -1;

  return (
    <div className="w-full bg-darker-blue-300 border border-dark rounded-2xl p-3 flex flex-col justify-center items-center">
      <img
        src={foodGroup.properties.imageUrl}
        className="w-full max-w-28 h-auto object-contain pointer-events-none"
        loading="lazy"
        alt={foodGroup.title}
      />

      <span className="text-white text-base font-peyda font-medium">
        {foodGroup.title}
      </span>

      <div
        className="w-full flex flex-row justify-center items-center gap-2 mt-2"
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") {
            setHoveredIndex(null);
          }
        }}
      >
        {options.map((option, index) => {
          const activeIndex =
            hoveredIndex !== null
              ? Math.max(selectedIndex, hoveredIndex)
              : selectedIndex;

          const isFilled = index <= activeIndex;

          return (
            <div
              key={`${foodGroup.code}-${option}`}
              className="
                w-7
                aspect-square
                border
                border-darker-blue-100
                rounded-full
                cursor-pointer
                transition-[background-color,transform,box-shadow]
                duration-150
                ease-out
              "
              style={{
                backgroundColor: isFilled ? valueColor : "#0d0e12",
              }}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") {
                  setHoveredIndex(index);
                }
              }}
              onClick={() => {
                const nextValue =
                  value === option
                    ? index === 0
                      ? 0
                      : options[index - 1]
                    : option;

                onClick(nextValue, foodGroup.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(FoodFrequencyCard);
