import { memo } from "react";
import { PiBowlSteam, PiCheckBold } from "react-icons/pi";
import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";
import Button from "@/shared/base-components/button";
import type { DietFoodDto } from "@/features/dashboard/api/dto/diet-day.dto";

const MealReplacementFoodCard = memo(function MealReplacementFoodCard({
  food,
  selected,
  onSelect,
  loading = false,
}: {
  food: Partial<DietFoodDto>;
  selected: boolean;
  onSelect: () => void;
  loading?: boolean;
}) {
  return (
    <article
      dir="rtl"
      className="flex min-w-0 items-center gap-[0.714em] rounded-[20px] border border-[#292F37] bg-[#0D0E12] px-3 py-[9px] font-yekan text-[13px] mobile:text-[14px] fold:text-[16px] laptop:text-[18px]"
    >
      {food.image_url ? (
        <ImageWithSkeleton
          key={food.image_url}
          src={food.image_url}
          alt={food.title ?? ""}
          wrapperClassName="size-[2.571em] shrink-0 rounded-[0.714em] bg-[#DBF0F8]"
          className="size-full object-cover"
        />
      ) : (
        <span className="flex size-[2.571em] shrink-0 items-center justify-center rounded-[0.714em] bg-[#DBF0F8] text-black">
          <PiBowlSteam aria-hidden="true" className="size-[2.143em]" />
        </span>
      )}
      <div className="min-w-0 flex-1 text-right">
        <h3
          title={food.title ?? undefined}
          className="truncate text-[1em] leading-[1.4] font-peyda font-bold text-[#DEE2E0]"
        >
          {food.title || "غذای جایگزین"}
        </h3>
        <p className="text-[0.857em] leading-[1.4] font-peyda text-[#527B88]">
          {food.quantity?.display_label_fa || "—"}
        </p>
      </div>
      {selected ? (
        <span className="flex shrink-0 items-center justify-center gap-1 rounded-[10px] border border-[#2CE57F] bg-[#12663F]/40 px-[1em] py-[0.429em] text-[0.857em] leading-[1.4] font-bold text-[#2CE57F]">
          <PiCheckBold
            aria-hidden="true"
            className="compact:text-xl fold:text-2xl laptop:text-3xl"
          />
          <label className="mt-1">فعال</label>
        </span>
      ) : (
        <Button
          type="button"
          title="انتخاب"
          loading={loading}
          disable={loading}
          onClick={onSelect}
          classes="btn btn-outline-green w-auto! shrink-0 rounded-[10px]! border! border-[#2CE57F]! px-[1em]! py-[0.429em]! text-[0.857em]! leading-[1.4] text-[#2CE57F]! transition-colors duration-200! hover:bg-[#12663F]/30 motion-reduce:transition-none [&>div>div]:mt-1"
        />
      )}
    </article>
  );
});

export default MealReplacementFoodCard;
