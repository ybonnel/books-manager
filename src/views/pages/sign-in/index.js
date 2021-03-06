import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {Chrome, Github, Twitter} from 'react-feather';

import {authActions} from '../../../core/auth';

import './sign-in.css';

export class SignIn extends React.Component{
    render() {
        const {signInWithGoogle} = this.props;

        return (
            <section className="sign-in">
                <div className="wrapper">
                    <h1 className="sign-in__header">Sign in</h1>
                    <ul className="sign-in__links">
                        <li className="sign-in__links__link" onClick={signInWithGoogle}>
                            <Chrome className="sign-in__links__link__icon"/>
                            <a className="sign-in__links__link__label">Google</a>
                        </li>
                    </ul>
                </div>
            </section>
        );
    }

}

SignIn.propTypes = {
    signInWithGithub: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
    signInWithTwitter: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------
function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.authenticated,
    };
}

export default withRouter(connect(
    mapStateToProps,
    authActions
)(SignIn));
