import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import App from './App'
import { createAcceptedConsent, STORAGE_KEY } from './lib/storage'
import type { PersistedState } from './types'

async function addItem(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(await screen.findByRole('button', { name: 'Add item' }))
  await user.type(screen.getByLabelText('Item text'), text)
  await user.click(screen.getByRole('button', { name: 'Save' }))
}

function createBackupFile(state: unknown, name = 'backup.json') {
  return new File([JSON.stringify(state)], name, { type: 'application/json' })
}

function createPersistedState(overrides: Partial<PersistedState> = {}): PersistedState {
  return {
    version: 1,
    items: [],
    settings: {
      language: 'en',
      themeMode: 'system',
      ...overrides.settings,
    },
    lastResetAt: null,
    consent: createAcceptedConsent('2026-03-28T00:00:00.000Z'),
    ...overrides,
  }
}

function renderAcceptedApp(overrides: Partial<PersistedState> = {}) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(createPersistedState(overrides)))
  return render(<App />)
}

describe('CheckBefore app', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the consent gate on first launch and saves acceptance', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Review the app terms before you start' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: "Today's checklist" })).not.toBeInTheDocument()

    await user.click(
      screen.getByRole('checkbox', {
        name: /I have reviewed the Terms of Use, Privacy Policy, and local storage notice/i,
      }),
    )
    await user.click(screen.getByRole('button', { name: 'Agree and start' }))

    expect(await screen.findByRole('heading', { name: "Today's checklist" })).toBeInTheDocument()

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.consent).toMatchObject({
      termsVersion: '2026-03-28',
      privacyPolicyVersion: '2026-03-28',
      storageNoticeVersion: '2026-03-28',
    })
    expect(persisted.consent.acceptedAt).toEqual(expect.any(String))
  })

  it('keeps protected routes behind the consent gate until accepted', async () => {
    window.location.hash = '#/settings'

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Review the app terms before you start' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('keeps legal pages reachable before consent and returns to the consent gate', async () => {
    window.location.hash = '#/terms'

    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Terms of Use' })).toBeInTheDocument()
    expect(screen.getByText('Last updated: 2026-03-28')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(
      await screen.findByRole('heading', { name: 'Review the app terms before you start' }),
    ).toBeInTheDocument()
  })

  it('adds and toggles items', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await addItem(user, 'Wallet')

    expect(await screen.findByText('Wallet')).toBeInTheDocument()

    const toggle = screen.getByRole('checkbox', { name: 'Toggle Wallet' })
    expect(toggle).toHaveAttribute('aria-checked', 'false')

    await user.click(toggle)
    expect(screen.getByRole('checkbox', { name: 'Toggle Wallet' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByText('Checked')).toBeInTheDocument()
  })

  it('edits and deletes existing items', async () => {
    const user = userEvent.setup()
    renderAcceptedApp({
      items: [
        {
          id: 'wallet',
          text: 'Wallet',
          checked: false,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
    })

    expect(await screen.findByText('Wallet')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Open actions for Wallet'))
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }))
    const input = screen.getByLabelText('Item text')
    await user.clear(input)
    await user.type(input, 'Wallet and keys')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Wallet and keys')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Open actions for Wallet and keys'))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))
    expect(await screen.findByText('Delete this item?')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Wallet and keys')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Open actions for Wallet and keys'))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete item' }))

    await waitFor(() => {
      expect(screen.queryByText('Wallet and keys')).not.toBeInTheDocument()
    })
  })

  it('resets checked items only after confirmation', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await addItem(user, 'Phone')
    await user.click(screen.getByLabelText('Toggle Phone'))

    await user.click(screen.getByRole('button', { name: 'Reset all' }))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByText('Checked')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Reset all' })).toBeEnabled()
    })
    await user.click(screen.getByRole('button', { name: 'Reset all' }))
    await user.click(screen.getByRole('button', { name: 'Reset everything' }))
    expect(await screen.findByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('Last reset: just now')).toBeInTheDocument()
  })

  it('restores persisted items and saved language/theme settings', async () => {
    renderAcceptedApp({
      items: [
        {
          id: '1',
          text: 'Pasaporte',
          checked: false,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
      settings: {
        language: 'es',
        themeMode: 'dark',
      },
    })

    expect(await screen.findByRole('heading', { name: 'Lista de hoy' })).toBeInTheDocument()
    expect(screen.getByText('Pasaporte')).toBeInTheDocument()

    await userEvent.setup().click(await screen.findByLabelText('Configuración'))
    expect(await screen.findByLabelText('Idioma')).toHaveTextContent('Español')
    expect(screen.getByLabelText('Tema')).toHaveTextContent('Oscuro')
  })

  it('persists language and theme changes from settings', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await user.click(await screen.findByLabelText('Settings'))

    const [languageSelect, themeSelect] = await screen.findAllByRole('combobox')

    fireEvent.mouseDown(languageSelect)
    const languageListbox = await screen.findByRole('listbox')
    await user.click(within(languageListbox).getByText('日本語'))

    fireEvent.mouseDown(themeSelect)
    const themeListbox = await screen.findByRole('listbox')
    await user.click(within(themeListbox).getByText('ダーク'))

    await waitFor(() => {
      const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
      expect(persisted.settings.language).toBe('ja')
      expect(persisted.settings.themeMode).toBe('dark')
    })

    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument()
  })

  it('falls back to the checklist page when settings is opened directly and back is pressed', async () => {
    window.location.hash = '#/settings'

    const user = userEvent.setup()
    renderAcceptedApp()

    expect(await screen.findByRole('heading', { name: 'Settings' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Back' }))

    expect(await screen.findByRole('heading', { name: "Today's checklist" })).toBeInTheDocument()
  })

  it('shows the actual checked state on the reorder page', async () => {
    window.location.hash = '#/reorder'

    renderAcceptedApp({
      items: [
        {
          id: 'wallet',
          text: 'Wallet',
          checked: true,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
        {
          id: 'keys',
          text: 'Keys',
          checked: false,
          order: 1,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
    })

    expect(await screen.findByRole('heading', { name: 'Reorder items' })).toBeInTheDocument()
    expect(screen.getByText('Wallet')).toBeInTheDocument()
    expect(screen.getByText('Keys')).toBeInTheDocument()
    expect(screen.getByText('Checked')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('restores a backup after confirmation', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      createBackupFile(
        createPersistedState({
          items: [
            {
              id: 'wallet',
              text: 'Wallet',
              checked: true,
              order: 0,
              createdAt: '2026-03-27T00:00:00.000Z',
              updatedAt: '2026-03-27T00:00:00.000Z',
            },
          ],
          settings: {
            language: 'ja',
            themeMode: 'dark',
          },
          lastResetAt: '2026-03-27T00:00:00.000Z',
          consent: createAcceptedConsent('2026-03-27T00:10:00.000Z'),
        }),
      ),
    )

    expect(
      await screen.findByText(
        'Importing backup.json will replace your current checklist, settings, and consent record.',
      ),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restore now' }))

    await waitFor(() => {
      const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
      expect(persisted.settings.language).toBe('ja')
      expect(persisted.settings.themeMode).toBe('dark')
      expect(persisted.items[0].text).toBe('Wallet')
      expect(persisted.lastResetAt).toBe('2026-03-27T00:00:00.000Z')
      expect(persisted.consent.acceptedAt).toBe('2026-03-27T00:10:00.000Z')
    })

    expect(await screen.findByText('バックアップを復元しました。')).toBeInTheDocument()
  })

  it('returns to the consent gate when a restored backup has no consent record', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      createBackupFile({
        version: 1,
        items: [],
        settings: {
          language: 'en',
          themeMode: 'system',
        },
        lastResetAt: null,
        consent: null,
      }),
    )

    expect(
      await screen.findByText(
        'Importing backup.json will replace your current checklist, settings, and consent record.',
      ),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restore now' }))

    expect(
      await screen.findByRole('heading', { name: 'Review the app terms before you start' }),
    ).toBeInTheDocument()
  })

  it('exports the current checklist state as a backup file', async () => {
    const user = userEvent.setup()
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:backup')
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const originalCreateElement = document.createElement.bind(document)
    const anchorClick = vi.fn()
    let downloadName = ''

    vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      if (tagName === 'a') {
        const anchor = originalCreateElement('a')
        anchor.click = anchorClick
        Object.defineProperty(anchor, 'download', {
          configurable: true,
          get: () => downloadName,
          set: (value: string) => {
            downloadName = value
          },
        })
        return anchor
      }

      return originalCreateElement(tagName)
    }) as typeof document.createElement)

    renderAcceptedApp({
      items: [
        {
          id: 'wallet',
          text: 'Wallet',
          checked: true,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
      settings: {
        language: 'en',
        themeMode: 'dark',
      },
      lastResetAt: '2026-03-27T05:30:00.000Z',
      consent: createAcceptedConsent('2026-03-27T05:31:00.000Z'),
    })

    await user.click(await screen.findByLabelText('Settings'))
    await user.click(await screen.findByRole('button', { name: 'Download backup' }))

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1)
    expect(anchorClick).toHaveBeenCalledTimes(1)
    expect(downloadName).toMatch(/^checkbefore-backup-\d{4}-\d{2}-\d{2}\.json$/)
    await waitFor(() => {
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:backup')
    })

    const exportedBlob = createObjectURLSpy.mock.calls[0][0] as Blob
    const exportedState = JSON.parse(await exportedBlob.text())
    expect(exportedState.settings.themeMode).toBe('dark')
    expect(exportedState.items[0].text).toBe('Wallet')
    expect(exportedState.items[0].checked).toBe(true)
    expect(exportedState.lastResetAt).toBe('2026-03-27T05:30:00.000Z')
    expect(exportedState.consent.acceptedAt).toBe('2026-03-27T05:31:00.000Z')
  })

  it('shows an error when the selected backup file cannot be read', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await user.click(await screen.findByLabelText('Settings'))
    const unreadableFile = new File(['{}'], 'broken.json', { type: 'application/json' })
    Object.defineProperty(unreadableFile, 'text', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error('read failed')),
    })

    await user.upload(screen.getByLabelText('Select backup file'), unreadableFile)

    expect(await screen.findByText('The selected file is not a valid CheckBefore backup.')).toBeInTheDocument()
  })

  it('keeps the current state when backup restore is canceled', async () => {
    const user = userEvent.setup()
    renderAcceptedApp({
      items: [
        {
          id: 'keys',
          text: 'Keys',
          checked: false,
          order: 0,
          createdAt: '2026-03-27T00:00:00.000Z',
          updatedAt: '2026-03-27T00:00:00.000Z',
        },
      ],
    })

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      createBackupFile(
        createPersistedState({
          items: [],
          settings: {
            language: 'ja',
            themeMode: 'dark',
          },
        }),
        'replacement.json',
      ),
    )

    expect(
      await screen.findByText(
        'Importing replacement.json will replace your current checklist, settings, and consent record.',
      ),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.settings.language).toBe('en')
    expect(persisted.items[0].text).toBe('Keys')
  })

  it('rejects invalid backup files without replacing state', async () => {
    const user = userEvent.setup()
    renderAcceptedApp()

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      new File(['{"version":1,"items":[],"settings":{"language":"fr","themeMode":"dark"}}'], 'invalid.json', {
        type: 'application/json',
      }),
    )

    expect(await screen.findByText('The selected file is not a valid CheckBefore backup.')).toBeInTheDocument()
    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.settings.language).not.toBe('fr')
  })
})
