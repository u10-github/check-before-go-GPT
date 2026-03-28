export type Language = 'en' | 'es' | 'ja'
export type ThemeMode = 'system' | 'light' | 'dark'

export interface ChecklistItem {
  id: string
  text: string
  checked: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  language: Language
  themeMode: ThemeMode
}

export interface ConsentState {
  acceptedAt: string
  termsVersion: string
  privacyPolicyVersion: string
  storageNoticeVersion: string
}

export interface PersistedState {
  version: 1
  items: ChecklistItem[]
  settings: AppSettings
  lastResetAt: string | null
  consent: ConsentState | null
}
