import {
  createDefaultState,
  loadPersistedState,
  parsePersistedState,
  savePersistedState,
  serializePersistedState,
  STORAGE_KEY,
} from './storage'

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

  it('parses a valid backup and normalizes item order', () => {
    const result = parsePersistedState(
      JSON.stringify({
        version: 1,
        items: [
          {
            id: 'b',
            text: 'Phone',
            checked: false,
            order: 4,
            createdAt: '2026-03-27T00:00:00.000Z',
            updatedAt: '2026-03-27T00:00:00.000Z',
          },
          {
            id: 'a',
            text: 'Wallet',
            checked: true,
            order: 2,
            createdAt: '2026-03-27T00:00:00.000Z',
            updatedAt: '2026-03-27T00:00:00.000Z',
          },
        ],
        settings: {
          language: 'ja',
          themeMode: 'dark',
        },
      }),
    )

    expect(result).toEqual({
      status: 'success',
      state: {
        version: 1,
        items: [
          {
            id: 'a',
            text: 'Wallet',
            checked: true,
            order: 0,
            createdAt: '2026-03-27T00:00:00.000Z',
            updatedAt: '2026-03-27T00:00:00.000Z',
          },
          {
            id: 'b',
            text: 'Phone',
            checked: false,
            order: 1,
            createdAt: '2026-03-27T00:00:00.000Z',
            updatedAt: '2026-03-27T00:00:00.000Z',
          },
        ],
        settings: {
          language: 'ja',
          themeMode: 'dark',
        },
      },
    })
  })

  it('rejects malformed or invalid backup content', () => {
    expect(parsePersistedState('{bad-json')).toEqual({
      status: 'error',
      reason: 'invalid-json',
    })

    expect(
      parsePersistedState(
        JSON.stringify({
          version: 1,
          items: [],
          settings: {
            language: 'fr',
            themeMode: 'dark',
          },
        }),
      ),
    ).toEqual({
      status: 'error',
      reason: 'invalid-state',
    })
  })

  it('serializes backup content in a readable format', () => {
    const serialized = serializePersistedState({
      version: 1,
      items: [],
      settings: {
        language: 'en',
        themeMode: 'system',
      },
    })

    expect(serialized).toContain('\n')
    expect(JSON.parse(serialized)).toEqual({
      version: 1,
      items: [],
      settings: {
        language: 'en',
        themeMode: 'system',
      },
    })
  })
})
