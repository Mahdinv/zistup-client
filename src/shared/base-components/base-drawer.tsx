import type { ReactNode } from "react";
import { PiXCircle } from "react-icons/pi";
import { cn } from "../lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerSwipeHandle,
  DrawerTitle,
} from "./drawer";
import ScrollFade from "./scroll-fade";

type BaseDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  title: string;
  description?: string;
  header?: ReactNode;
  headerContent?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  stickyFooter?: boolean;
  height?: "content" | "half" | "full";
  theme?: "light" | "dark";
  className?: string;
};

const BaseDrawer = ({
  open,
  onOpenChange,
  onOpenChangeComplete,
  title,
  description,
  header,
  headerContent,
  children,
  footer,
  stickyFooter = true,
  height = "content",
  theme,
  className,
}: BaseDrawerProps) => {
  const footerContent =
    footer != null && typeof footer !== "boolean" ? (
      <footer
        data-slot="base-drawer-footer"
        className="shrink-0 border-t border-blue-500/60 dark:border-darker-blue-100 px-4 fold:px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        {footer}
      </footer>
    ) : null;

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={onOpenChangeComplete}
      swipeDirection="down"
    >
      <DrawerContent
        swipeHandle={
          <DrawerSwipeHandle className="group-data-[swipe-axis=y]/drawer-popup:h-5 group-data-[swipe-axis=y]/drawer-popup:items-center group-data-[swipe-axis=y]/drawer-popup:after:w-14 after:bg-blue-500 dark:after:bg-dark" />
        }
        dir="rtl"
        data-dashboard-theme={theme}
        className={cn(
          "dashboard-theme mx-auto w-full max-w-107.5 overflow-hidden border-blue-500/60 bg-blue-300 text-dark scheme-light dark:border-darker-blue-100 dark:bg-darker-blue-200 dark:text-white dark:scheme-dark data-[swipe-direction=down]:rounded-t-3xl after:bg-inherit motion-reduce:transition-none [--scroll-fade-color:var(--color-blue-300)] dark:[--scroll-fade-color:var(--color-darker-blue-200)]",
          height === "full"
            ? "h-[calc(100dvh-env(safe-area-inset-top,0px))] max-h-[calc(100dvh-env(safe-area-inset-top,0px))]"
            : "max-h-[calc(100dvh-2rem-env(safe-area-inset-top,0px))]",
          height === "half" && "h-[50dvh]",
          height === "content" && "h-auto",
          className,
        )}
      >
        {header !== undefined && (
          <DrawerTitle className="sr-only">{title}</DrawerTitle>
        )}
        {description && (
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        )}
        <header className="shrink-0 border-b border-blue-500/60 dark:border-darker-blue-100 px-4 fold:px-6 pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              {header !== undefined ? (
                header
              ) : (
                <DrawerTitle className="font-yekan font-extrabold text-inherit compact:text-lg fold:text-xl laptop:text-2xl">
                  {title}
                </DrawerTitle>
              )}
            </div>
            <DrawerClose
              aria-label={`بستن ${title}`}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-blue-800 dark:text-blue-700 hover:bg-blue-200 dark:hover:bg-darker-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <PiXCircle
                className="compact:text-3xl fold:text-4xl laptop:text-5xl"
                aria-hidden="true"
              />
            </DrawerClose>
          </div>
          {headerContent != null && <div className="mt-3">{headerContent}</div>}
        </header>
        <ScrollFade
          wrapperClassName="flex h-auto flex-1 flex-col"
          className="h-auto min-h-0 flex-1 overscroll-contain"
        >
          <div data-slot="base-drawer-body" className="min-w-0 p-4 fold:p-6">
            {children}
          </div>
          {!stickyFooter && footerContent}
        </ScrollFade>
        {stickyFooter && footerContent}
      </DrawerContent>
    </Drawer>
  );
};

export default BaseDrawer;
