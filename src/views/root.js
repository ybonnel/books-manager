import React from 'react';
import {PropTypes} from 'prop-types';
import {Provider} from 'react-redux';
import {BrowserRouter, Route} from 'react-router-dom';

import App from './app';
import {paths} from './components/authRoute/paths';


export default function Root({history, store}) {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Route path={paths.BOOKS} component={App}/>
            </BrowserRouter>
        </Provider>
    );
}

Root.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
};
