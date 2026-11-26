import { useEffect, useRef, useState } from 'react'

export type TelegramColorScheme = 'light' | 'dark'

export type TelegramUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

type ThemeParams = {
  bg_color?: string
  secondary_bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  destructive_text_color?: string
}

type SafeInset = { top: number; bottom: number; left: number; right: number }

export type PopupButton = {
  id?: string
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  close: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor?: (color: string) => void
  platform: string
  colorScheme: TelegramColorScheme
  themeParams: ThemeParams
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    start_param?: string
    auth_date?: number
    hash?: string
  }
  BackButton: {
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  MainButton: {
    setText: (text: string) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  showConfirm: (message: string, cb?: (ok: boolean) => void) => void
  showPopup: (
    params: { title?: string; message: string; buttons?: PopupButton[] },
    cb?: (id: string) => void,
  ) => void
  onEvent: (event: string, cb: () => void) => void
  offEvent: (event: string, cb: () => void) => void
  contentSafeAreaInset?: SafeInset
  safeAreaInset?: SafeInset
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp }
  }
}

const THEME_VARS: Record<keyof ThemeParams, string> = {
  bg_color: '--tg-theme-bg-color',
  secondary_bg_color: '--tg-theme-secondary-bg-color',
  text_color: '--tg-theme-text-color',
  hint_color: '--tg-theme-hint-color',
  link_color: '--tg-theme-link-color',
  button_color: '--tg-theme-button-color',
  button_text_color: '--tg-theme-button-text-color',
  destructive_text_color: '--tg-theme-destructive-text-color',
}

const LIGHT_PREVIEW: Record<string, string> = {
  '--tg-theme-bg-color': '#ffffff',
  '--tg-theme-secondary-bg-color': '#f2f2f7',
  '--tg-theme-text-color': '#000000',
  '--tg-theme-hint-color': '#8e8e93',
  '--tg-theme-link-color': '#007aff',
  '--tg-theme-button-color': '#007aff',
  '--tg-theme-button-text-color': '#ffffff',
  '--tg-theme-destructive-text-color': '#ff3b30',
}

export type DialogState =
  | { kind: 'confirm'; message: string; resolve: (ok: boolean) => void }
  | {
      kind: 'popup'
      title?: string
      message: string
      buttons: PopupButton[]
      resolve: (id: string) => void
    }
  | null

let dialog: DialogState = null
const dialogListeners = new Set<() => void>()

function setDialog(next: DialogState) {
  dialog = next
  dialogListeners.forEach((listener) => listener())
}

export function getDialog(): DialogState {
  return dialog
}

export function subscribeDialog(listener: () => void): () => void {
  dialogListeners.add(listener)
  return () => dialogListeners.delete(listener)
}

export function resolveDialog(value: boolean | string) {
  const current = dialog
  setDialog(null)
  if (!current) return
  if (current.kind === 'confirm') current.resolve(value === true)
  else current.resolve(typeof value === 'string' ? value : '')
}

export function closeDialog() {
  const current = dialog
  if (!current) return
  resolveDialog(current.kind === 'confirm' ? false : '')
}

export function getTelegram(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null
  return window.Telegram?.WebApp ?? null
}

export function isTelegramEnv(): boolean {
  const tg = getTelegram()
  if (!tg) return false
  return Boolean(tg.initData) || (Boolean(tg.platform) && tg.platform !== 'unknown')
}

function safe(fn: () => void) {
  try {
    fn()
  } catch {
    /* старый клиент или браузер без метода */
  }
}

function wantsLightPreview(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('theme') === 'light'
}

function clearThemeVars() {
  const root = document.documentElement
  for (const cssVar of Object.values(THEME_VARS)) root.style.removeProperty(cssVar)
}

function syncSafeArea(tg: TelegramWebApp) {
  const root = document.documentElement
  const content = tg.contentSafeAreaInset
  if (!content) return
  root.style.setProperty('--tg-content-safe-area-inset-top', `${content.top}px`)
  root.style.setProperty('--tg-content-safe-area-inset-bottom', `${content.bottom}px`)
  root.style.setProperty('--tg-content-safe-area-inset-left', `${content.left}px`)
  root.style.setProperty('--tg-content-safe-area-inset-right', `${content.right}px`)
}

function applyTheme(tg: TelegramWebApp | null) {
  const root = document.documentElement
  if (!tg || !isTelegramEnv()) {
    if (wantsLightPreview()) {
      root.dataset.theme = 'light'
      root.style.colorScheme = 'light'
      for (const [cssVar, value] of Object.entries(LIGHT_PREVIEW)) {
        root.style.setProperty(cssVar, value)
      }
      const meta = document.querySelector('meta[name="theme-color"]')
      meta?.setAttribute('content', '#ffffff')
      return
    }
    clearThemeVars()
    root.dataset.theme = 'dark'
    root.style.colorScheme = 'dark'
    return
  }

  const scheme: TelegramColorScheme = tg.colorScheme === 'light' ? 'light' : 'dark'
  root.dataset.theme = scheme
  root.style.colorScheme = scheme
  const params = tg.themeParams ?? {}
  for (const [key, cssVar] of Object.entries(THEME_VARS) as Array<[keyof ThemeParams, string]>) {
    const value = params[key]
    if (value) root.style.setProperty(cssVar, value)
  }
  syncSafeArea(tg)
  const bg = params.bg_color
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
  safe(() => tg.setHeaderColor('secondary_bg_color'))
  safe(() => tg.setBackgroundColor?.('bg_color'))
}

export function initTelegram(): () => void {
  const tg = getTelegram()
  if (tg) {
    safe(() => tg.ready())
    safe(() => tg.expand())
    safe(() => tg.setHeaderColor('secondary_bg_color'))
    safe(() => tg.setBackgroundColor?.('bg_color'))
  }
  applyTheme(tg)
  if (!tg) return () => {}

  const onTheme = () => applyTheme(tg)
  const onSafe = () => {
    if (isTelegramEnv()) syncSafeArea(tg)
  }
  tg.onEvent('themeChanged', onTheme)
  tg.onEvent('viewportChanged', onSafe)
  tg.onEvent('safeAreaChanged', onSafe)
  tg.onEvent('contentSafeAreaChanged', onSafe)
  return () => {
    tg.offEvent('themeChanged', onTheme)
    tg.offEvent('viewportChanged', onSafe)
    tg.offEvent('safeAreaChanged', onSafe)
    tg.offEvent('contentSafeAreaChanged', onSafe)
  }
}

export function useTelegramInit() {
  useEffect(() => initTelegram(), [])
}

export function getTelegramUser(): TelegramUser | null {
  return getTelegram()?.initDataUnsafe?.user ?? null
}

export function useColorScheme(): TelegramColorScheme {
  const [scheme, setScheme] = useState<TelegramColorScheme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  useEffect(() => {
    const tg = getTelegram()
    const read = () => {
      applyTheme(tg)
      setScheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
    }
    if (!tg) return
    tg.onEvent('themeChanged', read)
    return () => tg.offEvent('themeChanged', read)
  }, [])
  return scheme
}

export function hapticPress() {
  safe(() => getTelegram()?.HapticFeedback.impactOccurred('light'))
}

export function hapticNotification(type: 'success' | 'error' | 'warning') {
  safe(() => getTelegram()?.HapticFeedback.notificationOccurred(type))
}

export function hapticSuccess() {
  hapticNotification('success')
}

export function hapticError() {
  hapticNotification('error')
}

export function useBackButton(enabled: boolean, onBack?: () => void) {
  useEffect(() => {
    const tg = getTelegram()
    if (!tg || !enabled || !isTelegramEnv()) return
    const handler = () => {
      hapticPress()
      if (onBack) onBack()
      else window.history.back()
    }
    safe(() => tg.BackButton.show())
    tg.BackButton.onClick(handler)
    return () => {
      tg.BackButton.offClick(handler)
      safe(() => tg.BackButton.hide())
    }
  }, [enabled, onBack])
}

type MainButtonOptions = {
  text: string
  visible?: boolean
  enabled?: boolean
  loading?: boolean
  onClick: () => void
}

export function useMainButton({
  text,
  visible = true,
  enabled = true,
  loading = false,
  onClick,
}: MainButtonOptions) {
  const onClickRef = useRef(onClick)
  useEffect(() => {
    onClickRef.current = onClick
  })

  useEffect(() => {
    const tg = getTelegram()
    if (!tg || !isTelegramEnv()) return
    const handler = () => {
      hapticPress()
      onClickRef.current()
    }
    tg.MainButton.onClick(handler)
    return () => tg.MainButton.offClick(handler)
  }, [])

  useEffect(() => {
    const tg = getTelegram()
    if (!tg || !isTelegramEnv()) return
    safe(() => tg.MainButton.setText(text))
    if (loading) safe(() => tg.MainButton.showProgress(false))
    else safe(() => tg.MainButton.hideProgress())
    if (enabled && !loading) safe(() => tg.MainButton.enable())
    else safe(() => tg.MainButton.disable())
    if (visible) safe(() => tg.MainButton.show())
    else safe(() => tg.MainButton.hide())
  }, [text, visible, enabled, loading])

  useEffect(() => {
    return () => {
      const tg = getTelegram()
      if (!tg || !isTelegramEnv()) return
      safe(() => tg.MainButton.hide())
      safe(() => tg.MainButton.hideProgress())
    }
  }, [])
}

function openConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    setDialog({ kind: 'confirm', message, resolve })
  })
}

export function showConfirm(message: string): Promise<boolean> {
  const tg = getTelegram()
  if (tg && isTelegramEnv()) {
    return new Promise((resolve) => {
      try {
        tg.showConfirm(message, (ok) => resolve(Boolean(ok)))
      } catch {
        void openConfirm(message).then(resolve)
      }
    })
  }
  return openConfirm(message)
}

export function showPopup(params: {
  title?: string
  message: string
  buttons?: PopupButton[]
}): Promise<string> {
  const buttons: PopupButton[] = params.buttons?.length
    ? params.buttons
    : [{ id: 'ok', type: 'ok', text: 'Ок' }]
  const tg = getTelegram()
  if (tg && isTelegramEnv()) {
    return new Promise((resolve) => {
      try {
        tg.showPopup({ title: params.title, message: params.message, buttons }, (id) =>
          resolve(id ?? ''),
        )
      } catch {
        setDialog({
          kind: 'popup',
          title: params.title,
          message: params.message,
          buttons,
          resolve,
        })
      }
    })
  }
  return new Promise((resolve) => {
    setDialog({
      kind: 'popup',
      title: params.title,
      message: params.message,
      buttons,
      resolve,
    })
  })
}
