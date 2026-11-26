import { createContext, useContext } from 'react'

export type ToastTone = 'default' | 'success' | 'error'

export type ToastApi = {
  showToast: (message: string, tone?: ToastTone) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) throw new Error('useToast must be used within ToastProvider')
  return api
}
