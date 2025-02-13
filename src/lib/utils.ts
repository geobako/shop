import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function bankersRound(num: number, decimals = 2) {
  const factor = Math.pow(10, decimals);
  const scaledNum = num * factor;
  const rounded = Math.round(scaledNum);

  // If halfway (.5) and odd, round to even
  if (Math.abs(scaledNum % 1) === 0.5) {
    return (
      (Math.floor(scaledNum) % 2 === 0
        ? Math.floor(scaledNum)
        : Math.ceil(scaledNum)) / factor
    );
  }

  return rounded / factor;
}
