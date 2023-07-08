import type { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"

import "app/globals.css"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}

export default App
