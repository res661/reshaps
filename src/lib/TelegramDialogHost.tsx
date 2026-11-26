import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Button, type ButtonVariant } from '../components/Button.tsx'
import {
  getDialog,
  resolveDialog,
  subscribeDialog,
  type PopupButton,
} from './telegram.ts'
import styles from './TelegramDialogHost.module.css'

function buttonVariant(button: PopupButton): ButtonVariant {
  if (button.type === 'destructive') return 'danger'
  if (button.type === 'cancel' || button.type === 'close') return 'ghost'
  return 'primary'
}

function buttonLabel(button: PopupButton): string {
  if (button.text) return button.text
  if (button.type === 'cancel' || button.type === 'close') return 'Отмена'
  return 'Ок'
}

export function TelegramDialogHost() {
  const dialog = useSyncExternalStore(subscribeDialog, getDialog, getDialog)
  if (!dialog) return null

  const buttons: PopupButton[] =
    dialog.kind === 'confirm'
      ? [
          { id: 'ok', type: 'ok', text: 'Да' },
          { id: 'cancel', type: 'cancel', text: 'Отмена' },
        ]
      : dialog.buttons

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть"
        onClick={() => resolveDialog(dialog.kind === 'confirm' ? false : '')}
      />
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={dialog.kind === 'popup' ? dialog.title : undefined}>
        {dialog.kind === 'popup' && dialog.title ? <div className={styles.title}>{dialog.title}</div> : null}
        <div className={styles.message}>{dialog.message}</div>
        <div className={styles.actions}>
          {buttons.map((button, index) => (
            <Button
              key={button.id ?? `${button.type ?? 'btn'}-${index}`}
              variant={dialog.kind === 'confirm' && button.id === 'cancel' ? 'ghost' : buttonVariant(button)}
              onClick={() => {
                if (dialog.kind === 'confirm') resolveDialog(button.id === 'ok')
                else resolveDialog(button.id ?? button.type ?? '')
              }}
            >
              {buttonLabel(button)}
            </Button>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
