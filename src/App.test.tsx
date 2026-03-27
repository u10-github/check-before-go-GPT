import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { STORAGE_KEY } from './lib/storage'

async function addItem(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(await screen.findByRole('button', { name: 'Add item' }))
  await user.type(screen.getByLabelText('Item text'), text)
  await user.click(screen.getByRole('button', { name: 'Save' }))
}

function createBackupFile(state: unknown, name = 'backup.json') {
  return new File([JSON.stringify(state)], name, { type: 'application/json' })
}

describe('CheckBefore app', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
  })

  it('adds and toggles items', async () => {
    const user = userEvent.setup()
    render(<App />)

    await addItem(user, 'Wallet')

    const item = await screen.findByText('Wallet')
    expect(item).toBeInTheDocument()

    await user.click(screen.getByLabelText('Toggle Wallet'))
    expect(screen.getByText('Checked')).toBeInTheDocument()
  })

  it('edits and deletes existing items', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
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
        settings: {
          language: 'en',
          themeMode: 'system',
        },
      }),
    )

    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByText('Wallet')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Edit Wallet'))
    const input = screen.getByLabelText('Item text')
    await user.clear(input)
    await user.type(input, 'Wallet and keys')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Wallet and keys')).toBeInTheDocument()

    await user.click(screen.getByLabelText('Delete Wallet and keys'))
    await waitFor(() => {
      expect(screen.queryByText('Wallet and keys')).not.toBeInTheDocument()
    })
  })

  it('resets checked items only after confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)

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
  })

  it('restores persisted items and saved language/theme settings', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
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
      }),
    )

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Lista de hoy' })).toBeInTheDocument()
    expect(screen.getByText('Pasaporte')).toBeInTheDocument()

    await userEvent.setup().click(await screen.findByLabelText('Configuración'))
    expect(await screen.findByLabelText('Idioma')).toHaveTextContent('Español')
    expect(screen.getByLabelText('Tema')).toHaveTextContent('Oscuro')
  })

  it('persists language and theme changes from settings', async () => {
    const user = userEvent.setup()
    render(<App />)

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

  it('restores a backup after confirmation', async () => {
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

    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      createBackupFile({
        version: 1,
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
      }),
    )

    expect(await screen.findByText('Importing backup.json will replace your current checklist and settings.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restore now' }))

    await waitFor(() => {
      const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
      expect(persisted.settings.language).toBe('ja')
      expect(persisted.settings.themeMode).toBe('dark')
      expect(persisted.items[0].text).toBe('Wallet')
    })

    expect(await screen.findByText('バックアップを復元しました。')).toBeInTheDocument()
  })

  it('keeps the current state when backup restore is canceled', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
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
        settings: {
          language: 'en',
          themeMode: 'system',
        },
      }),
    )

    const user = userEvent.setup()
    render(<App />)

    await user.click(await screen.findByLabelText('Settings'))
    await user.upload(
      screen.getByLabelText('Select backup file'),
      createBackupFile({
        version: 1,
        items: [],
        settings: {
          language: 'ja',
          themeMode: 'dark',
        },
      }, 'replacement.json'),
    )

    expect(await screen.findByText('Importing replacement.json will replace your current checklist and settings.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(persisted.settings.language).toBe('en')
    expect(persisted.items[0].text).toBe('Keys')
  })

  it('rejects invalid backup files without replacing state', async () => {
    const user = userEvent.setup()
    render(<App />)

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
