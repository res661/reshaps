import styles from './Skeleton.module.css'

type SkeletonProps = {
  width?: number | string
  height?: number | string
  radius?: number | string
}

export function Skeleton({ width = '100%', height = 14, radius = 8 }: SkeletonProps) {
  return (
    <span
      className={styles.bone}
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  )
}
