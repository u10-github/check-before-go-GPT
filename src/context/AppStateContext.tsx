import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { loadPersistedState, savePersistedState } from '../lib/storage'
import type { AppSettings, ChecklistItem, Language, PersistedState, ThemeMode } from '../types'

interface AppStateContextValue {
  items: ChecklistItem[]
  settings: AppSettings
  addItem: (text: string) => void
  updateItem: (id: string, text: string) => void
  deleteItem: (id: string) => void
  toggleItem: (id: string) => void
  resetChecks: () => void
  moveItem: (id: string, direction: 'up' | 'down') => void
  setLanguage: (language: Language) => void
  setThemeMode: (themeMode: ThemeMode) => void
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined)

function now() {
  return new Date().toISOString()
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `item-${Date.now()}-${Math.round(Math.random() * 100000)}`
}

function normalizeOrder(items: ChecklistItem[]) {
  return items.map((item, index) => ({
    ...item,
    order: index,
  }))
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const [{ items, settings }, setState] = useState<PersistedState>(() => loadPersistedState())

  useEffect(() => {
    savePersistedState({ version: 1, items, settings })
  }, [items, settings])

  const addItem = useCallback((text: string) => {
    const timestamp = now()

    setState((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          id: createId(),
          text,
          checked: false,
          order: current.items.length,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    }))
  }, [])

  const updateItem = useCallback((id: string, text: string) => {
    setState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, text, updatedAt: now() } : item,
      ),
    }))
  }, [])

  const deleteItem = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      items: normalizeOrder(current.items.filter((item) => item.id !== id)),
    }))
  }, [])

  const toggleItem = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked, updatedAt: now() } : item,
      ),
    }))
  }, [])

  const resetChecks = useCallback(() => {
    setState((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, checked: false, updatedAt: now() })),
    }))
  }, [])

  const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
    setState((current) => {
      const nextItems = [...current.items].sort((left, right) => left.order - right.order)
      const index = nextItems.findIndex((item) => item.id === id)
      const targetIndex = direction === 'up' ? index - 1 : index + 1

      if (index < 0 || targetIndex < 0 || targetIndex >= nextItems.length) {
        return current
      }

      const [movedItem] = nextItems.splice(index, 1)
      nextItems.splice(targetIndex, 0, movedItem)

      return {
        ...current,
        items: normalizeOrder(
          nextItems.map((item) => ({
            ...item,
            updatedAt: item.id === id ? now() : item.updatedAt,
          })),
        ),
      }
    })
  }, [])

  const setLanguage = useCallback((language: Language) => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        language,
      },
    }))
  }, [])

  const setThemeMode = useCallback((themeMode: ThemeMode) => {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        themeMode,
      },
    }))
  }, [])

  const value = useMemo(
    () => ({
      items: [...items].sort((left, right) => left.order - right.order),
      settings,
      addItem,
      updateItem,
      deleteItem,
      toggleItem,
      resetChecks,
      moveItem,
      setLanguage,
      setThemeMode,
    }),
    [
      addItem,
      deleteItem,
      items,
      moveItem,
      resetChecks,
      setLanguage,
      setThemeMode,
      settings,
      toggleItem,
      updateItem,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }

  return context
}
