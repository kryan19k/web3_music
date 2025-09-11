/// <reference types="vite/client" />

// Spline Viewer Custom Element Declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string
        style?: React.CSSProperties
        onLoad?: () => void
      }
    }
  }
}
