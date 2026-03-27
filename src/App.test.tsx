import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { STORAGE_KEY } from './lib/storage'

async function addItem(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(await screen.findByRole('button', { name: 'Add item' }))
  await user.type(screen.getByLabelText('Item text'), text)
  await user.click(screen.getByRole('button', { name: 'Save' }))
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
})
