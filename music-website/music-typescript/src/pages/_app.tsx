import type { AppProps } from 'next/app'
import { Player } from 'src/components/player'
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { AppHeader } from 'src/components/header'
import { Scrollbar } from 'src/components/scrollbar'
import { SnackbarProvider } from 'notistack'
import { PageLoading } from 'src/components/loading'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const theme = createTheme({
  palette: {
    primary: {
      main: '#335eea',
    },
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  const { events } = useRouter()

  const [state, setState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  })

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }))
    }

    const handleRouteChangeEnd = () => {
      setState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }))
    }

    events.on('routeChangeStart', handleRouteChangeStart)
    events.on('routeChangeComplete', handleRouteChangeEnd)
    events.on('routeChangeError', handleRouteChangeEnd)

    return () => {
      events.off('routeChangeStart', handleRouteChangeStart)
      events.off('routeChangeComplete', handleRouteChangeEnd)
      events.off('routeChangeError', handleRouteChangeEnd)
    }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={1} autoHideDuration={600} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
          <Scrollbar>
            <PageLoading isRouteChanging={state.isRouteChanging} key={state.loadingKey} />
            <AppHeader />
            <Container
              maxWidth='xl'
              sx={{
                px: 1,
                mx: 'auto',
                pb: '80px',
                userSelect: 'none',
              }}
            >
              <Component {...pageProps} />
              <ReactQueryDevtools />
            </Container>
            <Player />
          </Scrollbar>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
