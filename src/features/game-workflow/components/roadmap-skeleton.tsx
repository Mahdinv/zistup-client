const RoadmapSkeleton = () => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="w-full">
      <div className="relative flex flex-col gap-4">
        <div className="absolute right-5 top-5 bottom-5 w-px bg-gray-700" />
        {steps.map((step, index) => (
          <div key={step} className="relative">
            <div className="absolute right-0 top-0 z-10 w-10 h-10 rounded-full bg-gray-700 animate-pulse shadow-md" />
            <div
              className={`mr-14 rounded-2xl bg-gray-700 animate-pulse shadow-lg ${index === 0 ? "h-30.5" : "h-19.5"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapSkeleton;
