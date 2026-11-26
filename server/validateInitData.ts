import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Проверка подписи Telegram.WebApp.initData.
 * Заготовка для будущего HTTP-слоя: эндпоинта здесь нет.
 * Токен берётся из BOT_TOKEN и не должен попадать в клиент.
 *
 * HMAC: секрет = HMAC_SHA256(bot_token, key "WebAppData"),
 * data-check-string — все поля кроме hash, по алфавиту, через \n.
 * Поле signature (Ed25519 для третьих сторон) в эту строку входит.
 */

export type InitDataUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export type InitDataFailureReason =
  | 'missing_token'
  | 'empty'
  | 'missing_hash'
  | 'bad_signature'
  | 'expired'
  | 'malformed'

export type ValidateInitDataResult =
  | {
      ok: true
      user: InitDataUser | null
      authDate: number
      startParam?: string
    }
  | {
      ok: false
      reason: InitDataFailureReason
    }

export type ValidateInitDataOptions = {
  botToken?: string
  nowSec?: number
  maxAgeSec?: number
}

const DAY_SEC = 24 * 60 * 60

export function validateInitData(
  initData: string,
  options: ValidateInitDataOptions = {},
): ValidateInitDataResult {
  const botToken = options.botToken ?? process.env.BOT_TOKEN ?? ''
  if (!botToken) return { ok: false, reason: 'missing_token' }

  const raw = initData.trim()
  if (!raw) return { ok: false, reason: 'empty' }

  const fields = parseInitData(raw.startsWith('?') ? raw.slice(1) : raw)
  if (!fields) return { ok: false, reason: 'malformed' }

  const hash = fields.get('hash')
  if (!hash) return { ok: false, reason: 'missing_hash' }
  fields.delete('hash')

  const dataCheckString = [...fields.entries()]
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest()
  const expected = createHmac('sha256', secret).update(dataCheckString).digest('hex')
  if (!hexEqual(expected, hash)) return { ok: false, reason: 'bad_signature' }

  const authRaw = fields.get('auth_date')
  if (!authRaw || !/^\d+$/.test(authRaw)) return { ok: false, reason: 'malformed' }
  const authDate = Number(authRaw)
  const nowSec = options.nowSec ?? Math.floor(Date.now() / 1000)
  const maxAgeSec = options.maxAgeSec ?? DAY_SEC
  if (nowSec - authDate > maxAgeSec) return { ok: false, reason: 'expired' }

  const userRaw = fields.get('user')
  let user: InitDataUser | null = null
  if (userRaw) {
    let parsed: unknown
    try {
      parsed = JSON.parse(userRaw)
    } catch {
      return { ok: false, reason: 'malformed' }
    }
    if (!isUser(parsed)) return { ok: false, reason: 'malformed' }
    user = parsed
  }

  const startParam = fields.get('start_param')
  return startParam
    ? { ok: true, user, authDate, startParam }
    : { ok: true, user, authDate }
}

function parseInitData(raw: string): Map<string, string> | null {
  const map = new Map<string, string>()
  for (const part of raw.split('&')) {
    if (!part) continue
    const eq = part.indexOf('=')
    const rawKey = eq === -1 ? part : part.slice(0, eq)
    const rawValue = eq === -1 ? '' : part.slice(eq + 1)
    try {
      const key = decodeURIComponent(rawKey)
      const value = decodeURIComponent(rawValue.replace(/\+/g, '%20'))
      map.set(key, value)
    } catch {
      return null
    }
  }
  return map
}

function hexEqual(a: string, b: string): boolean {
  const left = Buffer.from(a.toLowerCase(), 'utf8')
  const right = Buffer.from(b.toLowerCase(), 'utf8')
  if (left.length === 0 || left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

function isUser(value: unknown): value is InitDataUser {
  if (!value || typeof value !== 'object') return false
  const user = value as Record<string, unknown>
  return typeof user.id === 'number' && typeof user.first_name === 'string'
}
