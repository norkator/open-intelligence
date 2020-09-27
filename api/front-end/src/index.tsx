import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from "react-router-dom";
import './Magic.css'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from "redux";
import dateReducer from "./store/reducers/dateReducer";
import authReducer from "./store/reducers/authReducer";
import {composeWithDevTools} from 'redux-devtools-extension';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import i18nConfig from "./i18nConfig";
// import thunk from 'redux-thunk'; // Todo, install thunk if needed (lets you write async logic that interacts with the store)

// i18n translation config
i18next.init(i18nConfig);

const rootReducer = combineReducers({
  dateReducer: dateReducer,
  authReducer: authReducer,
  /* Add other reducers */
});

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(),
    // other store enhancers here if any
  )
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          <App/>
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
