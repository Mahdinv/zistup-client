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
  closeIcon?: ReactNode;
  appearance?: "default" | "quick-add-meal";
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
  appearance = "default",
  closeIcon,
}: BaseDrawerProps) => {
  const quickMeal = appearance === "quick-add-meal";
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
          quickMeal &&
            "border-0 data-[swipe-direction=down]:border-0 bg-[#c3e6f3] text-darker-green-200 dark:text-gray-200 [--scroll-fade-color:#c3e6f3] [&>div>header]:pb-4 [&>div>header]:border-blue-500 dark:[&>div>header]:border-darker-blue-100 [&_[data-slot=drawer-close]]:h-8 [&_[data-slot=drawer-close]]:w-6 [&_[data-slot=drawer-swipe-handle]]:h-6 [&_[data-slot=drawer-swipe-handle]]:items-start [&_[data-slot=drawer-swipe-handle]]:pt-[7px] [&_[data-slot=drawer-swipe-handle]]:after:h-[5px] [&_[data-slot=drawer-swipe-handle]]:after:w-[57px] [&_[data-slot=drawer-title]]:text-[20px] [&_[data-slot=drawer-title]]:leading-[1.2] [&_[data-slot=base-drawer-body]]:p-4 [&_[data-slot=base-drawer-footer]]:pb-[max(18px,env(safe-area-inset-bottom))]",
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
              {closeIcon ?? (
                <PiXCircle
                  className="compact:text-3xl fold:text-4xl laptop:text-5xl"
                  aria-hidden="true"
                />
              )}
            </DrawerClose>
          </div>
          {headerContent != null && (
            <div className={quickMeal ? "mt-4" : "mt-3"}>{headerContent}</div>
          )}
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
