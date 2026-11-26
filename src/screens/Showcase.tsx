import {
  AlertCircle,
  ArrowDownToLine,
  Bell,
  ChartColumn,
  Clock,
  Heart,
  Inbox,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Repeat,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '../components/Badge.tsx'
import { BottomSheet } from '../components/BottomSheet.tsx'
import { Button } from '../components/Button.tsx'
import { Card } from '../components/Card.tsx'
import { Cell } from '../components/Cell.tsx'
import { Checkbox } from '../components/Checkbox.tsx'
import { Chips } from '../components/Chips.tsx'
import { EmptyState } from '../components/EmptyState.tsx'
import { HeroBalance } from '../components/HeroBalance.tsx'
import { Input } from '../components/Input.tsx'
import { List, Section } from '../components/Section.tsx'
import { QuickActions } from '../components/QuickActions.tsx'
import { Radio } from '../components/Radio.tsx'
import { Skeleton } from '../components/Skeleton.tsx'
import { StoriesRow } from '../components/StoriesRow.tsx'
import { Switch } from '../components/Switch.tsx'
import { Tabs } from '../components/Tabs.tsx'
import { useToast } from '../components/useToast.ts'
import {
  getTelegramUser,
  isTelegramEnv,
  showConfirm,
  showPopup,
  useBackButton,
  useColorScheme,
  useMainButton,
} from '../lib/telegram.ts'
import styles from './Showcase.module.css'

type ScreenName = 'root' | 'details'

const stories = [
  { id: 'new', title: 'Новое', background: 'linear-gradient(160deg, #2f7cf6, #6c5ce7)' },
  { id: 'pay', title: 'Выплаты', background: 'linear-gradient(160deg, #2ecc71, #32ade6)' },
  { id: 'links', title: 'Ссылки', background: 'linear-gradient(160deg, #ff9500, #ff3b4e)' },
  { id: 'stats', title: 'Статы', background: 'linear-gradient(160deg, #32ade6, #2f7cf6)' },
  { id: 'help', title: 'Помощь', background: 'linear-gradient(160deg, #ff5fa2, #6c5ce7)' },
]

export function Showcase() {
  const { showToast } = useToast()
  const scheme = useColorScheme()
  const user = getTelegramUser()
  const inTelegram = isTelegramEnv()
  const scrollY = useRef(0)
  const [screen, setScreen] = useState<ScreenName>(() =>
    window.history.state?.screen === 'details' ? 'details' : 'root',
  )
  const [chips, setChips] = useState<string[]>(['all'])
  const [tab, setTab] = useState('overview')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [notify, setNotify] = useState(true)
  const [vibrate, setVibrate] = useState(false)
  const [agree, setAgree] = useState(true)
  const [news, setNews] = useState(false)
  const [pay, setPay] = useState('card')
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (screen === 'details') window.scrollTo(0, 0)
  }, [screen])

  useEffect(() => {
    const onPop = () => {
      const next: ScreenName = window.history.state?.screen === 'details' ? 'details' : 'root'
      setScreen(next)
      if (next === 'root') window.scrollTo(0, scrollY.current)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openDetails = () => {
    scrollY.current = window.scrollY
    window.history.pushState({ screen: 'details' }, '')
    setScreen('details')
    window.scrollTo(0, 0)
  }

  useBackButton(screen === 'details')
  useMainButton({
    text: 'Готово',
    visible: screen === 'root',
    onClick: () => showToast('Сохранено', 'success'),
  })

  const themeLabel = scheme === 'light' ? 'светлая' : 'тёмная'
  const hint = user
    ? `${user.first_name} · ${themeLabel}`
    : `Демо компонентов · ${themeLabel}`

  return (
    <>
      <div className="screen" hidden={screen !== 'root'}>
        <header className={styles.header}>
          <h1>Витрина</h1>
          <p>{hint}</p>
        </header>

        <HeroBalance label="Баланс" value="12 480 ₽" tag="Демо" />

        <StoriesRow
          className={styles.stories}
          items={stories.map((story) => ({
            ...story,
            onClick: () => showToast(story.title),
          }))}
        />

        <QuickActions
          items={[
            { id: 'create', label: 'Создать', icon: <Plus size={22} />, color: 'blue', onClick: () => showToast('Создать') },
            { id: 'link', label: 'Ссылка', icon: <Link2 size={22} />, color: 'cyan', onClick: () => showToast('Ссылка') },
            { id: 'out', label: 'Вывод', icon: <ArrowDownToLine size={22} />, color: 'green', onClick: () => showToast('Вывод') },
            { id: 'stats', label: 'Статы', icon: <ChartColumn size={22} />, color: 'purple', onClick: () => showToast('Статы') },
            { id: 'chat', label: 'Чат', icon: <MessageCircle size={22} />, color: 'pink', onClick: () => showToast('Чат') },
            { id: 'more', label: 'Ещё', icon: <MoreHorizontal size={22} />, color: 'slate', disabled: true },
          ]}
        />

        <Section title="Сервисы" footer="Пример списка">
          <List>
            <Cell
              title="Подписки"
              subtitle="Активные"
              value="3"
              icon={<Repeat size={20} />}
              iconColor="blue"
              chevron
              onClick={() => showToast('Подписки')}
            />
            <Cell
              title="Донаты"
              icon={<Heart size={20} />}
              iconColor="pink"
              chevron
              onClick={() => showToast('Донаты')}
            />
            <Cell
              title="Выплаты"
              value="2 400 ₽"
              icon={<Wallet size={20} />}
              iconColor="green"
              chevron
              onClick={() => showToast('Выплаты')}
            />
            <Cell
              title="Ошибка оплаты"
              value="Сбой"
              icon={<AlertCircle size={20} />}
              iconColor="red"
              error
              chevron
              onClick={() => showToast('Сбой', 'error')}
            />
            <Cell title="Обновление" icon={<Clock size={20} />} iconColor="slate" loading />
            <Cell
              title="Уведомления"
              icon={<Bell size={20} />}
              iconColor="orange"
              chevron
              disabled
              onClick={() => showToast('Уведомления')}
            />
            <Cell
              title="Детали"
              icon={<Sparkles size={20} />}
              iconColor="purple"
              chevron
              onClick={openDetails}
            />
          </List>
        </Section>

        <Section title="Фильтры">
          <Chips
            items={[
              { id: 'all', label: 'Все' },
              { id: 'active', label: 'Активные' },
              { id: 'archive', label: 'Архив' },
              { id: 'hidden', label: 'Скрытые', disabled: true },
            ]}
            value={chips}
            onChange={setChips}
          />
        </Section>

        <Section title="Разделы">
          <Tabs
            items={[
              { id: 'overview', label: 'Обзор' },
              { id: 'ops', label: 'Операции' },
              { id: 'settings', label: 'Настройки' },
              { id: 'soon', label: 'Скоро', disabled: true },
            ]}
            value={tab}
            onChange={setTab}
          />
        </Section>

        <Section title="Поля">
          <div className={styles.stack}>
            <Input label="Имя" value={name} onChange={setName} placeholder="Ваше имя" />
            <Input
              label="Сумма"
              value={amount}
              onChange={setAmount}
              placeholder="0"
              error={amount ? undefined : 'Введите сумму'}
            />
            <Input label="Комментарий" value="" onChange={() => {}} placeholder="Недоступно" disabled />
          </div>
        </Section>

        <Section title="Параметры">
          <List>
            <div className={styles.controls}>
              <Switch label="Уведомления" checked={notify} onChange={setNotify} />
              <Switch label="Вибрация" checked={vibrate} onChange={setVibrate} disabled />
              <Checkbox label="Согласен" checked={agree} onChange={setAgree} />
              <Checkbox label="Рассылка" checked={news} onChange={setNews} disabled />
              <Radio name="pay" value="card" label="Карта" checked={pay === 'card'} onChange={setPay} />
              <Radio name="pay" value="sbp" label="СБП" checked={pay === 'sbp'} onChange={setPay} />
              <Radio
                name="pay"
                value="cash"
                label="Наличные"
                checked={pay === 'cash'}
                disabled
                onChange={setPay}
              />
            </div>
          </List>
        </Section>

        <Section title="Кнопки">
          <div className={styles.stack}>
            <Button onClick={() => showToast('Нажато')}>Основная</Button>
            <Button variant="secondary" onClick={() => showToast('Нажато')}>
              Вторая
            </Button>
            <Button variant="ghost" onClick={() => showToast('Нажато')}>
              Тихая
            </Button>
            <Button variant="danger" onClick={() => showToast('Удалено', 'error')}>
              Удалить
            </Button>
            <Button disabled>Недоступно</Button>
            <Button loading>Подождите</Button>
          </div>
        </Section>

        <Section title="Метки">
          <Card>
            <div className={styles.badges}>
              <Badge>Новое</Badge>
              <Badge tone="accent">Акцент</Badge>
              <Badge tone="success">Успех</Badge>
              <Badge tone="error">Ошибка</Badge>
              <Badge tone="warning">Ждёт</Badge>
            </div>
          </Card>
        </Section>

        <Section title="Пусто">
          <EmptyState
            icon={<Inbox size={36} />}
            title="Пока пусто"
            description="Нет записей"
            action={<Button variant="secondary" onClick={() => showToast('Обновлено', 'success')}>Обновить</Button>}
          />
        </Section>

        <Section title="Загрузка">
          <Card>
            <div className={styles.skel}>
              <Skeleton width={36} height={36} radius={10} />
              <div className={styles.skelText}>
                <Skeleton width="72%" height={14} radius={6} />
                <Skeleton width="40%" height={12} radius={6} />
              </div>
            </div>
          </Card>
        </Section>

        <Section title="Отклик">
          <div className={styles.stack}>
            <Button variant="secondary" onClick={() => showToast('Готово')}>
              Тост
            </Button>
            <Button variant="secondary" onClick={() => showToast('Не вышло', 'error')}>
              Ошибка
            </Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              Шторка
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                void showConfirm('Закрыть демо?').then((ok) => {
                  if (ok) showToast('Закрыто', 'success')
                })
              }}
            >
              Вопрос
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                void showPopup({
                  title: 'Внимание',
                  message: 'Это только демо',
                  buttons: [{ id: 'ok', type: 'ok', text: 'Понятно' }],
                }).then((id) => {
                  if (id === 'ok') showToast('Принято', 'success')
                })
              }}
            >
              Окно
            </Button>
          </div>
        </Section>

        {inTelegram ? null : (
          <Button onClick={() => showToast('Сохранено', 'success')}>Готово</Button>
        )}
      </div>

      {screen === 'details' ? (
        <div className="screen">
          {inTelegram ? null : (
            <button type="button" className={styles.back} onClick={() => window.history.back()}>
              Назад
            </button>
          )}
          <header className={styles.header}>
            <h1>Детали</h1>
            <p>Вложенный экран</p>
          </header>
          <Card>
            <p className={styles.note}>Назад — системная кнопка Telegram</p>
          </Card>
        </div>
      ) : null}

      <BottomSheet open={sheet} title="Действие" onClose={() => setSheet(false)}>
        <p className={`${styles.note} ${styles.center}`}>Потяните вниз или нажмите фон</p>
        <Button variant="secondary" onClick={() => setSheet(false)}>
          Закрыть
        </Button>
      </BottomSheet>
    </>
  )
}
