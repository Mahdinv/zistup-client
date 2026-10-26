import ImageWithSkeleton from "@/shared/base-components/image-with-skeleton";

const ZistyarPage = () => {
  return (
    <div className="flex h-full min-h-0 items-center justify-center py-4">
      <ImageWithSkeleton
        src="/pwa/zistyar-img.webp"
        alt="هوش زیست‌یار به‌زودی فعال می‌شود؛ دستیار هوشمند تغذیه، سلامت و سبک زندگی"
        wrapperClassName="h-full min-h-0 w-full"
        className="h-full min-h-0 w-full object-contain"
      />
    </div>
  );
};

export default ZistyarPage;
