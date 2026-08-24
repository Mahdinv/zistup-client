import type { FoodGroup } from "../../api/food-group.types";
import { motion } from "framer-motion";

type FoodGroupCardProps = {
  foodGroup: FoodGroup;
  selected: boolean;
  disable: boolean;
  delay?: number;
  handleSelectCard: (foodGroupId: number) => void;
};

const FoodGroupCard = ({
  foodGroup,
  selected = false,
  disable = false,
  delay = 0,
  handleSelectCard,
}: FoodGroupCardProps) => {
  return (
    <motion.li
      initial={{
        opacity: 0,
        y: 20,
        scale: 0.95,
      }}
      animate={{
        opacity: disable ? 0.5 : 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className={`
                    bg-darker-blue-300 
                    ${disable ? "opacity-50" : !disable && selected ? "border-2 border-green-400 ring-1 ring-inset ring-green-400" : "border border-dark"} 
                    rounded-2xl 
                    p-3 
                    flex 
                    flex-col 
                    items-center
                    ${disable ? "cursor-not-allowed" : "cursor-pointer"}
                `}
      onClick={() => !disable && handleSelectCard(foodGroup.id)}
    >
      <img
        src={foodGroup.properties.imageUrl}
        className="w-full max-w-28 h-auto object-contain pointer-events-none"
        loading="lazy"
        alt={foodGroup.title}
      />
      <span className="text-white text-center compact:text-sm mobile:text-base fold:text-lg laptop:text-xl font-peyda font-medium">
        {foodGroup.title}
      </span>
    </motion.li>
  );
};

export default FoodGroupCard;
