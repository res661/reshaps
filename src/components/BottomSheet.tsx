import { useEffect, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './BottomSheet.module.css'

type BottomSheetProps = {
  open: boolean
  title?: string
  children: ReactNode
  onClose: () => void
}

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLButtonElement>(null)
  const drag = useRef({ y: 0, t: 0, active: false })

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    sheet.style.transform = ''
    sheet.style.transition = ''
    if (backdropRef.current) backdropRef.current.style.opacity = ''
  }, [open])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!open || event.button !== 0) return
    drag.current = { y: event.clientY, t: event.timeStamp, active: true }
    const sheet = sheetRef.current
    if (!sheet) return
    sheet.style.transition = 'none'
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active || !sheetRef.current) return
    const dy = Math.max(0, event.clientY - drag.current.y)
    sheetRef.current.style.transform = `translateY(${dy}px)`
    if (backdropRef.current) {
      backdropRef.current.style.opacity = String(Math.max(0, 1 - dy / 320))
    }
  }

  const finishDrag = (clientY: number, time: number) => {
    if (!drag.current.active || !sheetRef.current) return
    const dy = Math.max(0, clientY - drag.current.y)
    const velocity = dy / Math.max(1, time - drag.current.t)
    drag.current.active = false
    const sheet = sheetRef.current
    sheet.style.transition = 'transform 200ms ease-out'
    if (dy > 90 || velocity > 0.65) {
      sheet.style.transform = 'translateY(calc(100% + 24px))'
      if (backdropRef.current) backdropRef.current.style.opacity = '0'
      window.setTimeout(onClose, 180)
      return
    }
    sheet.style.transform = 'translateY(0)'
    if (backdropRef.current) backdropRef.current.style.opacity = ''
    window.setTimeout(() => {
      if (!sheetRef.current) return
      sheetRef.current.style.transition = ''
      sheetRef.current.style.transform = ''
    }, 200)
  }

  return createPortal(
    <div className={styles.root} data-open={open ? 'true' : 'false'} inert={open ? undefined : true}>
      <button
        ref={backdropRef}
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={title ?? 'Шторка'}
        tabIndex={-1}
      >
        <div
          className={styles.handleZone}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(event) => finishDrag(event.clientY, event.timeStamp)}
          onPointerCancel={(event) => finishDrag(event.clientY, event.timeStamp)}
        >
          <div className={styles.handle} aria-hidden />
          {title ? <div className={styles.title}>{title}</div> : null}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
