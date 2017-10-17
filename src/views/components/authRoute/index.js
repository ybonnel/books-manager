import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Route, Redirect, withRouter} from 'react-router-dom';


class Auth extends React.Component {
    render() {
        const {component: Component, isAuthenticated, ...rest} = this.props;
        return (
            <Route
                {...rest}
                render={props => (isAuthenticated === true ?
                    <Component {...props} /> : <Redirect to={{pathname: '/sign-in'}}/>)}
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
                    <Component {...props} /> : <Redirect to={{pathname: '/'}}/>)}
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