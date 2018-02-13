import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";
import {createLogger} from "redux-logger";


export default () => {
    let composeEnhancers =  compose;
    let middleware = [thunkMiddleware];

    if(process.env.NODE_ENV !== 'production') {
        composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        middleware = [...middleware, createLogger()]
    }

    return createStore(
        reducers,
        composeEnhancers(
            applyMiddleware(
                ...middleware
            )
        )
    );
};
