import React from 'react';
import {PropTypes} from 'prop-types';


const Header = ({authenticated, name, signOut, goHome }) => {
    return (
        <nav>
            <div className="nav-wrapper">
                <a className="brand-logo" onClick={goHome}>BDtheque</a>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {authenticated ? <li><a onClick={signOut}>Sign Out</a></li> : null}
                    {!!name ? <li><em>{name}</em></li> : null}
                </ul>
            </div>
        </nav>
    );
};

Header.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired,
    goHome: PropTypes.func.isRequired
};

export default Header;
