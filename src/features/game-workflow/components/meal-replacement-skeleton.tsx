import { memo } from "react";
import Skeleton from "react-loading-skeleton";

const MealReplacementSkeleton = memo(function MealReplacementSkeleton() {
  return (
    <div role="status" aria-label="در حال دریافت غذاهای جایگزین" aria-busy="true" className="flex min-w-0 flex-col gap-2">
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index} aria-hidden="true" dir="rtl" className="flex min-w-0 items-center gap-[0.714em] rounded-[20px] border border-[#292F37] bg-[#0D0E12] px-3 py-[9px] font-yekan text-[13px] mobile:text-[14px] fold:text-[16px] laptop:text-[18px] motion-reduce:[&_.react-loading-skeleton]:after:animate-none">
          <Skeleton width="2.571em" height="2.571em" borderRadius="0.714em" containerClassName="shrink-0 leading-none" />
          <div className="min-w-0 flex-1">
            <div className="text-[1em] leading-[1.4]"><Skeleton width="85%" height="0.8em" /></div>
            <div className="text-[0.857em] leading-[1.4]"><Skeleton width="65%" height="0.7em" /></div>
          </div>
          <span className="shrink-0 rounded-[10px] border border-[#292F37] px-[1em] py-[0.429em] text-[0.857em] leading-[1.4]">
            <Skeleton width="2.5em" height="0.8em" />
          </span>
        </div>
      ))}
    </div>
  );
});

export default MealReplacementSkeleton;
