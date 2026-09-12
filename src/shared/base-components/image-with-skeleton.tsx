import { useState } from "react";
import { cn } from "@/shared/lib/utils";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
};

const ImageWithSkeleton = ({
  src,
  alt = "",
  className,
  wrapperClassName,
}: Props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <div className="absolute inset-0 bg-transparent" />}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </div>
  );
};

export default ImageWithSkeleton;
