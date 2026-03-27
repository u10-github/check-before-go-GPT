import { detectBrowserLanguage } from '../messages'
import type { AppSettings, ChecklistItem, PersistedState, ThemeMode } from '../types'

export const STORAGE_KEY = 'checkbefore.state.v1'

const DEFAULT_SETTINGS: AppSettings = {
  language: detectBrowserLanguage(),
  themeMode: 'system',
}

const DEFAULT_STATE: PersistedState = {
  version: 1,
  items: [],
  settings: DEFAULT_SETTINGS,
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

function isChecklistItem(value: unknown): value is ChecklistItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.checked === 'boolean' &&
    typeof candidate.order === 'number' &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.updatedAt === 'string'
  )
}

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    items: [],
    settings: {
      language: detectBrowserLanguage(),
      themeMode: 'system',
    },
  }
}

export function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return createDefaultState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>

    const items = Array.isArray(parsed.items)
      ? parsed.items.filter(isChecklistItem).sort((left, right) => left.order - right.order)
      : []

    const settings: AppSettings = {
      language:
        parsed.settings?.language === 'en' ||
        parsed.settings?.language === 'es' ||
        parsed.settings?.language === 'ja'
          ? parsed.settings.language
          : detectBrowserLanguage(),
      themeMode: isThemeMode(parsed.settings?.themeMode) ? parsed.settings.themeMode : 'system',
    }

    return {
      version: 1,
      items: items.map((item, index) => ({ ...item, order: index })),
      settings,
    }
  } catch {
    return createDefaultState()
  }
}

export function savePersistedState(state: PersistedState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
