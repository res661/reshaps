import type { ReactNode } from 'react'
import { cn } from '../lib/cn.ts'
import { hapticPress } from '../lib/telegram.ts'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
}: ButtonProps) {
  const inactive = disabled || loading
  return (
    <button
      type={type}
      className={cn(styles.btn, styles[variant])}
      disabled={inactive}
      data-loading={loading ? 'true' : undefined}
      aria-busy={loading || undefined}
      onClick={() => {
        if (inactive) return
        hapticPress()
        onClick?.()
      }}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span>{children}</span>
    </button>
  )
}
