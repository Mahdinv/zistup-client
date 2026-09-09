const retryCounts = new WeakMap<HTMLImageElement, number>();

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const SERVER_HOSTNAME = "api.zistup.com";

export function setupImageRetry() {
  document.addEventListener(
    "error",
    (event) => {
      const image = event.target;

      if (!(image instanceof HTMLImageElement)) return;

      const src = image.getAttribute("src");

      if (!src) return;

      const url = new URL(src, window.location.origin);

      if (url.hostname !== SERVER_HOSTNAME) return;

      const retryCount = retryCounts.get(image) ?? 0;

      if (retryCount >= MAX_RETRIES) return;

      retryCounts.set(image, retryCount + 1);

      const delay = RETRY_DELAY * 2 ** retryCount;

      window.setTimeout(() => {
        if (!image.isConnected) return;

        image.removeAttribute("src");

        requestAnimationFrame(() => {
          image.setAttribute("src", src);
        });
      }, delay);
    },
    true,
  );

  document.addEventListener(
    "load",
    (event) => {
      const image = event.target;

      if (image instanceof HTMLImageElement) {
        retryCounts.delete(image);
      }
    },
    true,
  );
}
