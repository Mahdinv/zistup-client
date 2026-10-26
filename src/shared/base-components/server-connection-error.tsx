import { PiHouse, PiArrowClockwise } from "react-icons/pi";
import Button from "./button";
import "./server-connection-error.css";

type ServerConnectionErrorProps = {
  onRetry: () => void;
  onHome: () => void;
  isRetrying?: boolean;
  theme?: "light" | "dark";
};

/** Theme is inherited from the dashboard unless explicitly supplied. */
export default function ServerConnectionError({
  onRetry,
  onHome,
  isRetrying = false,
  theme,
}: ServerConnectionErrorProps) {
  return (
    <section
      className="server-connection-error"
      data-dashboard-theme={theme}
      dir="rtl"
    >
      <div className="server-connection-error__content">
        <div role="alert">
          <h1 className="font-extrabold text-3xl fold:text-4xl">
            ارتباط با سرور برقرار نشد!
          </h1>
          <p className="server-connection-error__subtitle mt-1 text-lg">
            اتصال با اینترنت رو بررسی کن
          </p>
        </div>
        <img
          src="/pwa/router-img.webp"
          alt=""
          className="server-connection-error__image"
          draggable={false}
        />
        <div className="w-full max-w-60" aria-busy={isRetrying}>
          <Button
            title={isRetrying ? "در حال تلاش مجدد…" : "تلاش مجدد"}
            classes="btn server-connection-error__retry"
            icon={
              <PiArrowClockwise
                aria-hidden
                className={
                  isRetrying ? "motion-safe:animate-spin text-4xl" : "text-4xl"
                }
              />
            }
            itemsGap={10}
            disable={isRetrying}
            onClick={onRetry}
          />
        </div>
      </div>
      <footer className="server-connection-error__footer">
        <Button
          classes="btn btn-primary-green min-h-12 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          title="برگشت به صفحه اصلی"
          icon={<PiHouse aria-hidden className="text-4xl" />}
          itemsGap={12}
          onClick={onHome}
        />
      </footer>
    </section>
  );
}
