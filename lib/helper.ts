import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRatingStyle = (value: number) => {
  switch (value) {
    case 1:
      return "bg-red-50 text-red-700 border-red-200";
    case 2:
      return "bg-orange-50 text-orange-700 border-orange-200";
    case 3:
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case 4:
      return "bg-green-50 text-green-700 border-green-200";
    case 5:
      return "bg-teal-50 text-teal-700 border-teal-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};