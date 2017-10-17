import React from 'react';
import {PropTypes} from 'prop-types';
import {Link} from "react-router-dom";

import './header.css';
import { Book, LogOut } from 'react-feather';


const Header = ({authenticated, name, signOut }) => {
    return (
        <nav className="navigation">
            <div className="wrapper">
                <ul className="navigation-menu">
                    <li><Link className="navigation-menu__brand navigation-menu__link" to="/"><Book/> Book Manager</Link></li>
                    <li className="navigation-menu__user">
                        {!!name ? <span className="navigation-menu__user__name">{name}</span> : null}
                        {authenticated ? <a className="navigation-menu__user__logout navigation-menu__link" onClick={signOut}><LogOut/></a> : null}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

Header.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired
};

export default Header;
