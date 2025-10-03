import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(seed: number, width = 100, height = 100) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
