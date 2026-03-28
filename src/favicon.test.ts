import { describe, expect, it } from 'vitest'

import indexHtml from '../index.html?raw'
import viteConfigSource from '../vite.config.ts?raw'

describe('favicon configuration', () => {
  it('references the extracted favicon assets in index.html', () => {
    expect(indexHtml).toContain('<link rel="icon" href="/favicon.ico" sizes="any" />')
    expect(indexHtml).toContain(
      '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />',
    )
    expect(indexHtml).toContain(
      '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />',
    )
    expect(indexHtml).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png" />')
    expect(indexHtml).not.toContain('favicon.svg')
  })

  it('points the PWA config at the extracted favicon assets', () => {
    expect(viteConfigSource).toContain(
      "includeAssets: ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png']",
    )
    expect(viteConfigSource).toContain("src: 'android-chrome-192x192.png'")
    expect(viteConfigSource).toContain("src: 'android-chrome-512x512.png'")
    expect(viteConfigSource).not.toContain("src: 'maskable-icon-512.png'")
  })
})
