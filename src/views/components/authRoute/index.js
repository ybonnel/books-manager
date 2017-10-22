import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, withRouter} from 'react-router-dom';

import {paths} from './paths';


class Auth extends React.Component {
    render() {
        const {component: Component, isAuthenticated, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => (isAuthenticated === true ?
                    <Component {...props} /> : <Redirect to={paths.SIGN_IN}/>)}
            />
        )
    }
}
class UnAuth extends React.Component {
    render() {
        const {component: Component, isAuthenticated, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => (isAuthenticated !== true ?
                    <Component {...props} /> : <Redirect to={paths.BOOKS}/>)}
            />
        )
    }
}



function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.authenticated,
    };
}

export const AuthRoute = withRouter(connect(mapStateToProps, null)(Auth));
export const UnAuthRoute = withRouter(connect(mapStateToProps, null)(UnAuth));