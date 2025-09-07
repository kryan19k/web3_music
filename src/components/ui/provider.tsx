'use client'

import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export function Provider({ children }: { children: React.ReactNode }) {
  const customConfig = defineConfig({
    theme: {
      // Use tokens for values that don't change with light / dark themes
      tokens: {
        fonts: {
          body: {
            value: '"Manrope", "Arial", "Helvetica Neue", "Helvetica", sans-serif',
          },
          heading: {
            value: '{fonts.body}',
          },
          mono: {
            value: '"Roboto Mono", "Courier New", monospace',
          },
        },
      },
      // Use semantic tokens for light / dark values
      semanticTokens: {
        colors: {
          bg: {
            default: {
              value: {
                _light: 'transparent',
                _dark: 'transparent',
              },
            },
          },
        },
      },
    },
    globalCss: {
      // Minimal global styles to not interfere with Tailwind
      html: {
        scrollBehavior: 'smooth',
      },
    },
  })

  const system = createSystem(defaultConfig, customConfig)

  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
