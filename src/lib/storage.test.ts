import { createDefaultState, loadPersistedState, savePersistedState, STORAGE_KEY } from './storage'

describe('storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('creates a safe default state', () => {
    const state = createDefaultState()

    expect(state.version).toBe(1)
    expect(state.items).toEqual([])
    expect(state.settings.themeMode).toBe('system')
  })

  it('saves and loads persisted state', () => {
    const state = {
      version: 1 as const,
      items: [
        {
          id: 'a',
          text: 'Keys',
          checked: true,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
      settings: {
        language: 'en' as const,
        themeMode: 'light' as const,
      },
    }

    savePersistedState(state)

    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    expect(loadPersistedState()).toEqual(state)
  })

  it('falls back when data is invalid', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad-json')

    expect(loadPersistedState().items).toEqual([])
  })
})
