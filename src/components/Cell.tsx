import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { hapticPress } from '../lib/telegram.ts'
import type { TileColor } from './IconTile.tsx'
import { IconTile } from './IconTile.tsx'
import styles from './Cell.module.css'

type CellProps = {
  title: string
  subtitle?: string
  value?: string
  icon?: ReactNode
  iconColor?: TileColor
  chevron?: boolean
  disabled?: boolean
  loading?: boolean
  error?: boolean
  onClick?: () => void
}

export function Cell({
  title,
  subtitle,
  value,
  icon,
  iconColor = 'blue',
  chevron = false,
  disabled = false,
  loading = false,
  error = false,
  onClick,
}: CellProps) {
  const content = (
    <>
      {icon ? <IconTile color={iconColor}>{icon}</IconTile> : null}
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.sub}>{subtitle}</span> : null}
      </span>
      <span className={styles.right}>
        {loading ? <span className={styles.spinner} aria-hidden /> : null}
        {!loading && value ? <span className={styles.value}>{value}</span> : null}
        {chevron ? <ChevronRight size={18} aria-hidden /> : null}
      </span>
    </>
  )

  const shared = {
    className: styles.cell,
    'data-icon': icon ? 'true' : 'false',
    'data-error': error ? 'true' : 'false',
    'aria-busy': loading || undefined,
  }

  if (onClick) {
    return (
      <button
        type="button"
        {...shared}
        disabled={disabled || loading}
        onClick={() => {
          hapticPress()
          onClick()
        }}
      >
        {content}
      </button>
    )
  }

  return (
    <div {...shared} data-disabled={disabled ? 'true' : 'false'} aria-disabled={disabled || undefined}>
      {content}
    </div>
  )
}
