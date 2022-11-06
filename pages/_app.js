import '../styles/globals.css'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import store from '../app/store'
import { NavigationContextWraper } from '../context/navigationContext'

function MyApp({ Component, pageProps, session }) {
  return (
    <>
      <Head>
        <title>Unsil IF Kelas A Nihh Boss</title>
      </Head>
      <SessionProvider session={session} >
        <Provider store={store}>
          <NavigationContextWraper>
            <Component {...pageProps} />
          </NavigationContextWraper>
        </Provider>
      </SessionProvider>
    </>
  )
}

export default MyApp
