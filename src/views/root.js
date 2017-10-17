import React from 'react';
import {PropTypes} from 'prop-types';
import {Provider} from 'react-redux';
import {Route, Router} from 'react-router-dom';

import App from './app';

export const paths = {
    SIGN_IN: '/sign-in',
    BOOKS: '/'
};


export default function Root({history, store}) {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route path={paths.BOOKS} component={App}/>
            </Router>
        </Provider>
    );
}

Root.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};
