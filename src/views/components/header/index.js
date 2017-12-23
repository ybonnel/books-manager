import React from 'react';
import {PropTypes} from 'prop-types';
import {Link} from "react-router-dom";

import './header.css';
import { Book, LogOut, Menu } from 'react-feather';


class Header extends React.Component {
    constructor(props) {
        super(props);

        this.handleSignout = this.handleSignout.bind(this);
    }

    handleSignout() {
        this.props.signOut();
    }

    render() {
        const {authenticated, name } = this.props;
        const editions = [
            {label: 'Auteurs', key: 'author'},
            {label: 'Artistes', key: 'artist'},
            {label: 'Séries', key: 'serie'},
            {label: 'Editeurs', key: 'editor'},
            {label: 'Collections', key: 'collection'},
            {label: 'Styles', key: 'style'},
            {label: 'Localisations', key: 'location'}
        ];
        return (
            <nav className="navigation">
                <div className="wrapper">
                    <span className="navigation-menu__responsive">
                        <Link className="navigation-menu__brand navigation-menu__link" to="/"><Book/> <span className="navigation-menu__brand__label">Book Manager</span></Link>
                        <span className="navigation-menu__trigger" onClick={() => this.navigationMenu.classList.toggle('navigation-menu--toggled')}><Menu /></span>
                    </span>
                    <ul className="navigation-menu" ref={ref => this.navigationMenu = ref}>
                        {authenticated ? <li><Link className="navigation-menu__link navigation-menu__link__entry" to="/">Books</Link></li> : null}
                        {authenticated ? <li className="navigation-menu__link navigation-menu__link__entry navigation-menu__link--with-submenu">
                            Editions
                            <ul className="navigation-menu__link__submenu">
                                {editions.map((edition, idx) => <li className="" key={idx}>
                                    <Link className="navigation-menu__link__submenu__link" to={{pathname: '/editions', hash: edition.key}} onClick={() => this.navigationMenu.classList.toggle('navigation-menu--toggled')}>{edition.label}</Link>
                                </li>)}
                            </ul>
                        </li> : null}
                        <li className="navigation-menu__user">
                            {!!name ? <span className="navigation-menu__user__name">{name}</span> : null}
                            {authenticated ? <a className="navigation-menu__user__logout navigation-menu__link" onClick={this.handleSignout}><LogOut/></a> : null}
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

Header.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    signOut: PropTypes.func.isRequired
};

export default Header;
