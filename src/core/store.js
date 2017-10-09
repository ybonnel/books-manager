import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import {createLogger} from "redux-logger";


export default () => {
    const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    return createStore(
        reducers,
        composeEnhancers(
            applyMiddleware(
                createLogger(),
                thunkMiddleware
            )
        )
    );
};
