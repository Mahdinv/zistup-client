type AppLoaderProps = {
  theme?: "light" | "dark" | "neutral";
  fullScreen?: boolean;
  label?: string;
};

const themeClasses = {
  light: "bg-blue-300 text-darker-blue-200",
  dark: "bg-darker-blue-200 text-white",
  neutral: "bg-[#EDECEA] text-darker-blue-200",
};

const AppLoader = ({
  theme = "dark",
  fullScreen = false,
  label = "در حال آماده‌سازی...",
}: AppLoaderProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        flex
        w-full
        flex-col
        items-center
        justify-center
        gap-4
        ${fullScreen ? "h-dvh" : "h-full min-h-32"}
        ${themeClasses[theme]}
      `}
    >
      <div className="relative size-12" aria-hidden="true">
        {/* Static ring */}
        <span
          className="
            absolute
            inset-0
            rounded-full
            border-2
            border-blue-600/25
          "
        />

        {/* Rotating ring */}
        <span
          className="
            absolute
            inset-0
            animate-spin
            rounded-full
            border-2
            border-transparent
            border-r-green-400
            border-t-green-400
            motion-reduce:animate-none
          "
        />

        {/* Center */}
        <span
          className="
            absolute
            inset-3.75
            animate-pulse
            rounded-full
            bg-green-400
            motion-reduce:animate-none
          "
        />
      </div>

      <div className="text-center">
        <p className="font-yekan text-base font-extrabold">زیست‌آپ</p>

        <p className="mt-1 font-peyda text-xs opacity-60">{label}</p>
      </div>
    </div>
  );
};

export default AppLoader;
