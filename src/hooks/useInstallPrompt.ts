import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { PropsWithChildren } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type InstallState = 'prompt' | 'manual' | 'installed'

interface InstallPromptContextValue {
  installState: InstallState
  promptInstall: () => Promise<boolean>
}

const DISPLAY_MODE_QUERY = '(display-mode: standalone)'
const InstallPromptContext = createContext<InstallPromptContextValue | undefined>(undefined)

function isInstalled() {
  const standaloneDisplayMode =
    typeof window.matchMedia === 'function' && window.matchMedia(DISPLAY_MODE_QUERY).matches
  const standaloneNavigator = Boolean((navigator as Navigator & { standalone?: boolean }).standalone)

  return standaloneDisplayMode || standaloneNavigator
}

function addMediaQueryListener(mediaQuery: MediaQueryList, listener: () => void) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener)
    return
  }

  mediaQuery.addListener(listener)
}

function removeMediaQueryListener(mediaQuery: MediaQueryList, listener: () => void) {
  if (typeof mediaQuery.removeEventListener === 'function') {
    mediaQuery.removeEventListener('change', listener)
    return
  }

  mediaQuery.removeListener(listener)
}

function useInstallPromptState(): InstallPromptContextValue {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installState, setInstallState] = useState<InstallState>(() =>
    isInstalled() ? 'installed' : 'manual',
  )

  useEffect(() => {
    const mediaQuery =
      typeof window.matchMedia === 'function' ? window.matchMedia(DISPLAY_MODE_QUERY) : null

    const syncInstallState = () => {
      setInstallState((current) => {
        if (isInstalled()) {
          return 'installed'
        }

        return current === 'prompt' ? current : 'manual'
      })
    }

    const listener = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setInstallState('prompt')
    }

    const handleInstalled = () => {
      setDeferredPrompt(null)
      setInstallState('installed')
    }

    syncInstallState()
    window.addEventListener('beforeinstallprompt', listener)
    window.addEventListener('appinstalled', handleInstalled)
    if (mediaQuery) {
      addMediaQueryListener(mediaQuery, syncInstallState)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', listener)
      window.removeEventListener('appinstalled', handleInstalled)
      if (mediaQuery) {
        removeMediaQueryListener(mediaQuery, syncInstallState)
      }
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return false
    }

    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)

    if (choice.outcome === 'accepted') {
      setInstallState('installed')
      return true
    }

    setInstallState(isInstalled() ? 'installed' : 'manual')
    return true
  }, [deferredPrompt])

  return useMemo(
    () => ({
      installState,
      promptInstall,
    }),
    [installState, promptInstall],
  )
}

export function InstallPromptProvider({ children }: PropsWithChildren) {
  const value = useInstallPromptState()

  return createElement(InstallPromptContext.Provider, { value }, children)
}

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext)

  if (!context) {
    throw new Error('useInstallPrompt must be used within InstallPromptProvider')
  }

  return context
}
