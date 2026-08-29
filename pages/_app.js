import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import CommandPalette from '../components/CommandPalette'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CommandPalette />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
