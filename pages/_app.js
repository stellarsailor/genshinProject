import App from "next/app";
import { useEffect, useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import { appWithTranslation } from '../i18n'
import { serverUrl } from "../lib/serverUrl";

import Header from '../components/Header'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #1d1f29;
    color: white;
  }
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

function MyApp({ Component, pageProps }) {
  
  const [ assets, setAssets ] = useState([])

  useEffect(() => {
    async function fetchAssets() {

      let url = `${serverUrl}/api/assets`
  
      const res = await fetch(url)
      const data = await res.json()
      
      setAssets(data)
    }
    fetchAssets()
  },[])

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Header />
        <Component {...pageProps} assets={assets} />
      </ThemeProvider>
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const defaultProps = appContext.Component.defaultProps
  return {
      ...appProps,
      pageProps: {
          namespacesRequired: [...(appProps.pageProps.namespacesRequired || []), ...(defaultProps?.i18nNamespaces || [])],
          // providers: await providers(appContext)
      }
  }
}

export default appWithTranslation(MyApp)