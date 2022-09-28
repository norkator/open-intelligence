import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import './magic.css'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from "redux";
import dateReducer from "./store/reducers/dateReducer";
import authReducer from "./store/reducers/authReducer";
import {composeWithDevTools} from 'redux-devtools-extension';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import i18nConfig from "./i18nConfig";
import commonReducer from "./store/reducers/commonReducer";

// i18n translation config
i18next.init(i18nConfig);

const rootReducer = combineReducers({
  dateReducer: dateReducer,
  authReducer: authReducer,
  commonReducer: commonReducer,
  /* Add other reducers */
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(),
    // other store enhancers here if any
  )
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  // <React.StrictMode> // enable for help to spot side effects only in the development
  <Provider store={store}>
    <BrowserRouter>
      <I18nextProvider i18n={i18next}>
        <App error={null} loading={true} token={null} userId={null} authRedirectPath={''}/>
      </I18nextProvider>
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
