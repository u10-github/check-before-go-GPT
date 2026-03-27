import { detectBrowserLanguage } from '../messages'
import type { AppSettings, ChecklistItem, PersistedState, ThemeMode } from '../types'

export const STORAGE_KEY = 'checkbefore.state.v1'

type ParsePersistedStateErrorReason = 'invalid-json' | 'invalid-state'

export type ParsePersistedStateResult =
  | { status: 'success'; state: PersistedState }
  | { status: 'error'; reason: ParsePersistedStateErrorReason }

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

function isLanguage(value: unknown): value is AppSettings['language'] {
  return value === 'en' || value === 'es' || value === 'ja'
}

function normalizeItems(items: ChecklistItem[]) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .map((item, index) => ({ ...item, order: index }))
}

function normalizeState(input: { items: ChecklistItem[]; settings: AppSettings }): PersistedState {
  return {
    version: 1,
    items: normalizeItems(input.items),
    settings: input.settings,
  }
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
      ? parsed.items.filter(isChecklistItem)
      : []

    const settings: AppSettings = {
      language: isLanguage(parsed.settings?.language) ? parsed.settings.language : detectBrowserLanguage(),
      themeMode: isThemeMode(parsed.settings?.themeMode) ? parsed.settings.themeMode : 'system',
    }

    return normalizeState({ items, settings })
  } catch {
    return createDefaultState()
  }
}

export function parsePersistedState(raw: string): ParsePersistedStateResult {
  try {
    const parsed = JSON.parse(raw) as Partial<PersistedState>

    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.items) ||
      !parsed.items.every(isChecklistItem) ||
      !isLanguage(parsed.settings?.language) ||
      !isThemeMode(parsed.settings?.themeMode)
    ) {
      return { status: 'error', reason: 'invalid-state' }
    }

    return {
      status: 'success',
      state: normalizeState({
        items: parsed.items,
        settings: {
          language: parsed.settings.language,
          themeMode: parsed.settings.themeMode,
        },
      }),
    }
  } catch {
    return { status: 'error', reason: 'invalid-json' }
  }
}

export function serializePersistedState(state: PersistedState) {
  return JSON.stringify(state, null, 2)
}

export function savePersistedState(state: PersistedState) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
