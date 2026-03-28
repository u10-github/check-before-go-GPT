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
    expect(state.lastResetAt).toBeNull()
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
      lastResetAt: '2026-03-27T08:00:00.000Z',
    }

    savePersistedState(state)

    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull()
    expect(loadPersistedState()).toEqual(state)
  })

  it('falls back when data is invalid', () => {
    window.localStorage.setItem(STORAGE_KEY, '{bad-json')

    expect(loadPersistedState().items).toEqual([])
  })

  it('falls back when storage reads throw', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage access denied')
    })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(loadPersistedState()).toEqual(createDefaultState())
    expect(getItemSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  })

  it('falls back when a persisted payload has an unsupported version', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 2,
        items: [],
        settings: {
          language: 'en',
          themeMode: 'system',
        },
      }),
    )

    expect(loadPersistedState()).toEqual(createDefaultState())
  })

  it('normalizes missing lastResetAt from older persisted payloads', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [],
        settings: {
          language: 'en',
          themeMode: 'system',
        },
      }),
    )

    expect(loadPersistedState()).toEqual({
      version: 1,
      items: [],
      settings: {
        language: 'en',
        themeMode: 'system',
      },
      lastResetAt: null,
    })
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
        lastResetAt: '2026-03-27T08:30:00.000Z',
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
        lastResetAt: '2026-03-27T08:30:00.000Z',
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
      lastResetAt: null,
    })

    expect(serialized).toContain('\n')
    expect(JSON.parse(serialized)).toEqual({
      version: 1,
      items: [],
      settings: {
        language: 'en',
        themeMode: 'system',
      },
      lastResetAt: null,
    })
  })

  it('does not throw when localStorage persistence fails', () => {
    const state = createDefaultState()
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded')
    })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => savePersistedState(state)).not.toThrow()
    expect(setItemSpy).toHaveBeenCalledTimes(1)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to persist CheckBefore state.',
      expect.any(Error),
    )
  })
})
