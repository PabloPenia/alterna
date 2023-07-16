import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const formatter = new Intl.NumberFormat('es-UY', {
	style: 'currency',
	currency: 'UYU',
})
