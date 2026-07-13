import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// The site's mono eyebrow/label treatment (Space Mono, wide tracking, caps).
// Shared so the brand font stack lives in one place instead of being copied
// into every page and component that needs a mono label.
export const MONO =
  '[font-family:"Space_Mono","Courier_New",monospace] tracking-[0.55px] uppercase'
