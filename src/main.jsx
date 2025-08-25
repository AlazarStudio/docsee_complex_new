import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import * as serviceWorkerRegistration from '../serviceWorkerRegistration';
import { apolloClient } from "./apolloClient";
import { ApolloProvider } from '@apollo/client'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

serviceWorkerRegistration.register();