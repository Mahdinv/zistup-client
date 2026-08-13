import {
  isValidJalaaliDate,
  jalaaliMonthLength,
  toGregorian,
  toJalaali,
} from "jalaali-js";

export type JalaliDate = {
  year: number;
  month: number;
  day: number;
};

export const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

const persianNumberFormatter = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

const padNumber = (value: number, length = 2): string => {
  return String(value).padStart(length, "0");
};

export const createRange = (start: number, end: number): number[] => {
  if (end < start) {
    return [];
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
};

export const toPersianNumber = (value: number): string => {
  return persianNumberFormatter.format(value);
};

/**
 * ورودی‌های قابل قبول:
 *
 * 2000-05-21
 * 2000-05-21T00:00:00.000Z
 *
 * خروجی:
 *
 * 2000-05-21
 */
export const normalizeGregorianDate = (
  value?: string | null,
): string | null => {
  if (!value) {
    return null;
  }

  const datePart = value.trim().slice(0, 10);

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datePart);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(0);

  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  const isValid =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day;

  if (!isValid) {
    return null;
  }

  return [padNumber(year, 4), padNumber(month), padNumber(day)].join("-");
};

/**
 * تاریخ میلادی فرم یا سرور را برای نمایش
 * به تاریخ شمسی تبدیل می‌کند.
 */
export const gregorianToJalali = (value?: string | null): JalaliDate | null => {
  const normalizedDate = normalizeGregorianDate(value);

  if (!normalizedDate) {
    return null;
  }

  const [year, month, day] = normalizedDate.split("-").map(Number);

  const { jy, jm, jd } = toJalaali(year, month, day);

  return {
    year: jy,
    month: jm,
    day: jd,
  };
};

/**
 * تاریخ شمسی انتخاب‌شده را برای ارسال به سرور
 * به تاریخ میلادی YYYY-MM-DD تبدیل می‌کند.
 */
export const jalaliToGregorian = (value: JalaliDate): string => {
  const isValid = isValidJalaaliDate(value.year, value.month, value.day);

  if (!isValid) {
    throw new Error("Invalid Jalali date");
  }

  const { gy, gm, gd } = toGregorian(value.year, value.month, value.day);

  return [padNumber(gy, 4), padNumber(gm), padNumber(gd)].join("-");
};

export const getJalaliMonthDays = (year: number, month: number): number => {
  return jalaaliMonthLength(year, month);
};

export const getTodayJalali = (): JalaliDate => {
  const today = new Date();

  const { jy, jm, jd } = toJalaali(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );

  return {
    year: jy,
    month: jm,
    day: jd,
  };
};

export const isSameJalaliDate = (
  first: JalaliDate,
  second: JalaliDate,
): boolean => {
  return (
    first.year === second.year &&
    first.month === second.month &&
    first.day === second.day
  );
};
