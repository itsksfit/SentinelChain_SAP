import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import CommandPalette from '../components/CommandPalette'

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CommandPalette />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
