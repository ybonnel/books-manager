import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {authActions, getAuth} from '../../core/auth';
import {paths} from '../root';
import Header from '../components/header';
import {Switch} from "react-router-dom";
import {AuthRoute, UnAuthRoute} from '../components/authRoute'

import Books from "../pages/books/index";
import SignIn from "../pages/sign-in/index";

import './app.css';

class App extends Component {

    render() {
        return (
            <div>
                <Header
                    authenticated={this.props.auth.authenticated}
                    name={this.props.auth.email}
                    signOut={this.props.signOut}
                />

                <main className="main">
                    <Switch>
                        <UnAuthRoute path={paths.SIGN_IN} component={SignIn}/>
                        <AuthRoute path="" component={Books}/>
                    </Switch>
                </main>
            </div>
        );
    }
}

App.propTypes = {
    auth: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired
};

App.contextTypes = {
    router: PropTypes.object.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = createSelector(
    getAuth,
    auth => ({auth})
);

export default connect(
    mapStateToProps,
    authActions
)(App);
