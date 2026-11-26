import type { ReactNode } from 'react'
import styles from './IconTile.module.css'

export type TileColor = 'blue' | 'red' | 'purple' | 'green' | 'orange' | 'cyan' | 'pink' | 'slate'

type IconTileProps = {
  color: TileColor
  children: ReactNode
}

export function IconTile({ color, children }: IconTileProps) {
  return (
    <span className={`${styles.tile} ${styles[color]}`} aria-hidden>
      {children}
    </span>
  )
}
