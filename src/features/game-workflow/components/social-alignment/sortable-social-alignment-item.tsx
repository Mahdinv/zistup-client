import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";
import { RxDragHandleDots2 } from "react-icons/rx";

import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";

interface SortableSocialAlignmentItemProps {
  id: string;
  index: number;
  title?: string;
  imageUrl?: string;
}

const SortableSocialAlignmentItem = ({
  id,
  index,
  title,
  imageUrl,
}: SortableSocialAlignmentItemProps) => {
  const { ref, isDragging } = useSortable({
    id,
    index,
    modifiers: [RestrictToVerticalAxis],
  });

  return (
    <li
      ref={ref}
      className={`
        relative
        bg-darker-blue-500
        w-full
        h-13
        px-3
        flex
        flex-row
        items-center
        justify-center
        gap-1
        rounded-2xl
        shadow-md
        cursor-grab
        active:cursor-grabbing
        select-none
        touch-none
        transition-opacity
        ${isDragging ? "z-10 opacity-70 shadow-xl" : ""}
      `}
    >
      <RxDragHandleDots2 className="text-darker-blue-200 h-full shrink-0 compact:text-5xl fold:text-6xl laptop:text-7xl" />

      <ImageWithSkeleton
        src={imageUrl ?? ""}
        alt={title ?? ""}
        wrapperClassName="compact:size-12 fold:size-13 laptop:size-14"
        className="w-full h-full object-contain pointer-events-none"
      />

      <h5 className="text-white grow font-medium">{title}</h5>
    </li>
  );
};

export default SortableSocialAlignmentItem;
