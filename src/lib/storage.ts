import { detectBrowserLanguage } from '../messages'
import type { AppSettings, ChecklistItem, PersistedState, ThemeMode } from '../types'

export const STORAGE_KEY = 'checkbefore.state.v1'

type ParsePersistedStateErrorReason = 'invalid-json' | 'invalid-state'

export type ParsePersistedStateResult =
  | { status: 'success'; state: PersistedState }
  | { status: 'error'; reason: ParsePersistedStateErrorReason }

const CURRENT_STATE_VERSION = 1

const DEFAULT_SETTINGS: AppSettings = {
  language: detectBrowserLanguage(),
  themeMode: 'system',
}

const DEFAULT_STATE: PersistedState = {
  version: CURRENT_STATE_VERSION,
  items: [],
  settings: DEFAULT_SETTINGS,
  lastResetAt: null,
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

function normalizeState(input: {
  items: ChecklistItem[]
  settings: AppSettings
  lastResetAt?: string | null
}): PersistedState {
  return {
    version: CURRENT_STATE_VERSION,
    items: normalizeItems(input.items),
    settings: input.settings,
    lastResetAt: typeof input.lastResetAt === 'string' ? input.lastResetAt : null,
  }
}

function isSupportedStateVersion(value: unknown): value is PersistedState['version'] {
  return value === CURRENT_STATE_VERSION
}

function parseStateCandidate(candidate: unknown): ParsePersistedStateResult {
  if (typeof candidate !== 'object' || candidate === null) {
    return { status: 'error', reason: 'invalid-state' }
  }

  const parsed = candidate as Partial<PersistedState>

  if (
    !isSupportedStateVersion(parsed.version) ||
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
      lastResetAt: parsed.lastResetAt,
    }),
  }
}

export function createDefaultState(): PersistedState {
  return {
    version: CURRENT_STATE_VERSION,
    items: [],
    settings: {
      language: detectBrowserLanguage(),
      themeMode: 'system',
    },
    lastResetAt: null,
  }
}

export function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE
  }

  let raw: string | null

  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to read CheckBefore state.', error)
    return createDefaultState()
  }

  if (!raw) {
    return createDefaultState()
  }

  try {
    const parsed = JSON.parse(raw)
    const result = parseStateCandidate(parsed)

    return result.status === 'success' ? result.state : createDefaultState()
  } catch {
    return createDefaultState()
  }
}

export function parsePersistedState(raw: string): ParsePersistedStateResult {
  try {
    return parseStateCandidate(JSON.parse(raw))
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

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to persist CheckBefore state.', error)
  }
}
