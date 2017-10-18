import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {withRouter, Redirect} from "react-router-dom";
import {Github, Twitter, Chrome} from 'react-feather';

import {authActions} from '../../../core/auth';

import './sign-in.css';

export class SignIn extends React.Component{
    render() {
        const {signInWithGithub, signInWithGoogle, signInWithTwitter} = this.props;

        if (this.props.isAuthenticated) {
            return <Redirect to={this.props.from || '/'}/>
        }
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
