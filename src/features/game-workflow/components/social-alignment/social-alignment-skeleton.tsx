import Skeleton from "react-loading-skeleton";

const SocialAlignmentSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton width={64} height={64} borderRadius={20} />
          <Skeleton height={64} borderRadius={20} containerClassName="flex-1" />
        </div>
      ))}
    </div>
  );
};

export default SocialAlignmentSkeleton;
