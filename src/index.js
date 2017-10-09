import "whatwg-fetch";
import React from "react";
import ReactDOM from "react-dom";
import {createBrowserHistory} from "history";
import {syncHistoryWithStore} from "react-router-redux";

import registerServiceWorker from './registerServiceWorker';
import {initAuth} from "./core/auth";
import configureStore from "./core/store";
import Root from "./views/root";

if (!window.Symbol) {
    window.Symbol = Symbol; // yeah, polyfill all the things !!!
}

const store = configureStore();
const browserHistory = createBrowserHistory();
const syncedHistory = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');


function render(Root) {
    ReactDOM.render(
        <Root history={syncedHistory} store={store}/>,
        rootElement
    );
}

initAuth(store.dispatch)
    .then(() => {
        render(Root);
        registerServiceWorker();
    })
    .catch(error => console.error(error)); // eslint-disable-line no-console