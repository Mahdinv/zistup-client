import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export const getDisplayQuantity = (value: number | undefined, unit: string) => {
  if (value === undefined) {
    return {
      value: "",
      unit,
    };
  }

  if (unit === "کیلو" && value > 0 && value < 1) {
    return {
      value: Math.round(value * 1000).toString(),
      unit: "گرم",
    };
  }

  return {
    value: Number(value.toFixed(3)).toString(),
    unit,
  };
};
