import type { ReactNode } from 'react'
import { cn } from '../lib/cn.ts'
import { Card } from './Card.tsx'
import styles from './Section.module.css'

type SectionProps = {
  title?: string
  footer?: string
  children: ReactNode
  className?: string
}

export function Section({ title, footer, children, className }: SectionProps) {
  return (
    <section className={cn(styles.section, className)}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {children}
      {footer ? <p className={styles.footer}>{footer}</p> : null}
    </section>
  )
}

type ListProps = {
  children: ReactNode
  className?: string
}

export function List({ children, className }: ListProps) {
  return (
    <Card padded={false} className={className}>
      {children}
    </Card>
  )
}
