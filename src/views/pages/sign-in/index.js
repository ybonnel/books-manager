import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import {Github, Twitter, Chrome} from 'react-feather';

import {authActions} from '../../../core/auth';

import './sign-in.css';

export function SignIn({signInWithGithub, signInWithGoogle, signInWithTwitter}) {
    return (
        <section className="sign-in">
            <div className="wrapper">
                <h1 className="sign-in__header">Sign in</h1>
                <ul className="sign-in__links">
                    <li className="sign-in__links__link">
                        <Github className="sign-in__links__link__icon"/>
                        <a className="sign-in__links__link__label" onClick={signInWithGithub}>Github</a>
                    </li>
                    <li className="sign-in__links__link">
                        <Chrome className="sign-in__links__link__icon"/>
                        <a className="sign-in__links__link__label" onClick={signInWithGoogle}>Google</a>
                    </li>
                    <li className="sign-in__links__link">
                        <Twitter className="sign-in__links__link__icon"/>
                        <a className="sign-in__links__link__label" onClick={signInWithTwitter}>Twitter</a>
                    </li>
                </ul>
            </div>
        </section>
    );
}

SignIn.propTypes = {
    signInWithGithub: PropTypes.func.isRequired,
    signInWithGoogle: PropTypes.func.isRequired,
    signInWithTwitter: PropTypes.func.isRequired
};


//=====================================
//  CONNECT
//-------------------------------------

export default withRouter(connect(
    null,
    authActions
)(SignIn));
