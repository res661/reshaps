import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { hapticError, hapticSuccess } from '../lib/telegram.ts'
import styles from './Toast.module.css'
import { ToastContext, type ToastTone } from './useToast.ts'

type ToastItem = {
  id: number
  message: string
  tone: ToastTone
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastItem | null>(null)
  const timer = useRef<number | null>(null)

  const showToast = useCallback((message: string, tone: ToastTone = 'default') => {
    if (tone === 'success') hapticSuccess()
    if (tone === 'error') hapticError()
    if (timer.current) window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message, tone })
    timer.current = window.setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast
        ? createPortal(
            <div className={styles.wrap}>
              <div key={toast.id} className={styles.toast} role="status" aria-live="polite">
                <span
                  className={`${styles.dot} ${toast.tone === 'success' ? styles.success : ''} ${toast.tone === 'error' ? styles.error : ''}`}
                  aria-hidden
                />
                <span>{toast.message}</span>
              </div>
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}
