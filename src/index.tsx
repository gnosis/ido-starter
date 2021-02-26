import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'

import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { Loader, Title, theme } from '@gnosis.pm/safe-react-components'

import App from './App'
import GlobalStyle from './GlobalStyle'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider
        loader={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      >
        <App />
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
