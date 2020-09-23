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
import {composeWithDevTools} from 'redux-devtools-extension';
// import thunk from 'redux-thunk'; // Todo, install thunk if needed (lets you write async logic that interacts with the store)


const rootReducer = combineReducers({
  dateReducer: dateReducer,
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
        <App/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
