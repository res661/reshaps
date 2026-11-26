import type { ReactNode } from 'react'
import { cn } from '../lib/cn.ts'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'error' | 'warning'

type BadgeProps = {
  children: ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={cn(styles.badge, tone !== 'neutral' && styles[tone])}>{children}</span>
}
