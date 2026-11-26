import type { ReactNode } from 'react'
import { cn } from '../lib/cn.ts'
import styles from './Card.module.css'

type CardProps = {
  children: ReactNode
  padded?: boolean
  className?: string
}

export function Card({ children, padded = true, className }: CardProps) {
  return <div className={cn(styles.card, padded && styles.padded, className)}>{children}</div>
}
