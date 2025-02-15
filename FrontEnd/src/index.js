import React from "react"
import ReactDOM from 'react-dom/client';
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"
import { UserProvider } from './Authenticator/Usercontext';

import store from "./store"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
      <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <UserProvider>
          <App />
        </UserProvider>
      </BrowserRouter>
  </>
    </Provider>
);

serviceWorker.unregister()
