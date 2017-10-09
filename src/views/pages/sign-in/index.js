import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {authActions} from '../../../core/auth';

import "../../styles/signin.css";

export function SignIn({signInWithGithub, signInWithGoogle, signInWithTwitter}) {
    return (
        <div className="row">
            <div className="col s2 offset-s5 sign-in">
                <h1 className="sign-in__heading">Sign in</h1>
                <a className="waves-effect waves-light btn" onClick={signInWithGithub}><i className="material-icons left">cloud</i>Github</a>
                <a className="waves-effect waves-light btn" onClick={signInWithGoogle}><i className="material-icons left">cloud</i>Google</a>
                <a className="waves-effect waves-light btn" onClick={signInWithTwitter}><i className="material-icons left">cloud</i>Twitter</a>
            </div>
        </div>
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

export default connect(null, authActions)(SignIn);
