import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind 클래스를 안전하게 병합하는 유틸리티 함수 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
