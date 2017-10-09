import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {authActions, getAuth} from '../../core/auth';
import {paths} from '../routes';
import Header from '../components/header';


export class App extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        children: PropTypes.object.isRequired,
        signOut: PropTypes.func.isRequired
    };

    componentWillReceiveProps(nextProps) {
        const {router} = this.context;
        const {auth} = this.props;

        if (auth.authenticated && !nextProps.auth.authenticated) {
            router.replace(paths.SIGN_IN);
        }
        else if (!auth.authenticated && nextProps.auth.authenticated) {
            router.replace(paths.TASKS);
        }
    }

    render() {
        return (
            <div>
                <Header
                    authenticated={this.props.auth.authenticated}
                    name={this.props.auth.email}
                    signOut={this.props.signOut}
                    goHome={() => this.context.router.push('/')}
                />

                <main className="main">{this.props.children}</main>
            </div>
        );
    }
}


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
