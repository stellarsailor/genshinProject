import App from "next/app";
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { NextSeo } from 'next-seo';

import { appWithTranslation } from '../i18n'
import { serverUrl } from "../lib/serverUrl";

import Header from '../components/Header'
import Footer from '../components/Footer'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Noto Sans', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: #1d1f29;
    color: white;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-touch-callout: none;
  }
`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

const options = {
  position: positions.BOTTOM_CENTER,
  timeout: 3000,
  offset: '50px',
  transition: transitions.SCALE
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
      <NextSeo
        title="Genshin Party Build Helper"
        description="This helps you make Genshin party comp and a link to share easily! 원신 파티 조합 도우미"
        canonical="https://genshinparty.com/"
        openGraph={{
          url: 'https://genshinparty.com/',
          title: 'Genshin Party Build Helper',
          description: 'This helps you make Genshin party comp and a link to share easily! 원신 파티 조합 도우미',
          images: [
            { url: '/images/screenshot.jpg' },
          ],
          site_name: 'Genshin Party',
        }}
        twitter={{
          handle: '@handle',
          site: '@site',
          cardType: 'summary_large_image',
        }}
      />
      <ThemeProvider theme={theme}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        </Head>
        <AlertProvider template={AlertTemplate} {...options}>
        <Header />
          <Component {...pageProps} assets={assets} />
        <Footer />
        </AlertProvider>
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