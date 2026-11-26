import { ToastProvider } from './components/Toast.tsx'
import { TelegramDialogHost } from './lib/TelegramDialogHost.tsx'
import { useTelegramInit } from './lib/telegram.ts'
import { Showcase } from './screens/Showcase.tsx'

export default function App() {
  useTelegramInit()
  return (
    <ToastProvider>
      <div className="app">
        <Showcase />
      </div>
      <TelegramDialogHost />
    </ToastProvider>
  )
}
